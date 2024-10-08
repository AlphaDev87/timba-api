import { Cashier } from "@prisma/client";
import { HttpService } from "./http.service";
import { JwtService } from "./jwt.service";
import { decrypt } from "@/utils/crypt";
import { LoginResponse } from "@/types/response/agent";
import { ITokenRetreiver } from "@/types/services/http";
import { CustomError } from "@/helpers/error/CustomError";
import { CashierDAO } from "@/db/cashier";

/**
 * Generates and refreshes Agent's panel token
 */
export class CasinoTokenService extends JwtService implements ITokenRetreiver {
  private _username = "";
  private _password = "";
  private _token?: string;
  tokenNames = ["access"];

  constructor(private agent: Cashier) {
    super();
    this._username = agent.username;
    this._password = decrypt(agent.password);
  }

  private async loginDetails() {
    return {
      username: this._username,
      password: this._password,
    };
  }

  /**
   * Get access token from memory, DB or refresh
   * @returns access token if available and valid, null if not available
   * or expired
   */
  async token(): Promise<string | null> {
    return (await this.cachedToken()) || (await this.refreshToken());
  }

  async getAuth(): Promise<string[] | null> {
    const access = await this.token();
    if (!access) return null;
    return [access];
  }

  private async cachedToken(): Promise<string | null> {
    if (this._token && this.verifyTokenExpiration(this._token))
      return this._token;

    let agent = null;
    try {
      agent = await this.fetchAgentFromDb();
    } catch (error) {
      return null;
    }

    if (
      !agent?.access ||
      agent.dirty ||
      !this.verifyTokenExpiration(agent.access)
    ) {
      return null;
    }

    this._token = agent.access;
    return this._token;
  }

  /**
   * Si el refresh token está dentro de su fecha de expiración, se usa para
   * obtener un nuevo access token, sino se reloguea.
   * @returns Agent access token
   */
  async refreshToken(): Promise<string | null> {
    const agent = await this.fetchAgentFromDb();
    if (!agent?.refresh) return null;

    const isValid = this.verifyTokenExpiration(agent.refresh);
    if (!isValid) return null;
    try {
      const refreshUrl = "/accounts/refresh/";
      const { plainAgentApi } = new HttpService();

      const response = await plainAgentApi({
        url: refreshUrl,
        method: "POST",
        data: { refresh: agent.refresh },
      });

      const access: string = response.data.access;
      if (access) {
        await CashierDAO.update({
          where: { id: this.agent.id },
          data: { access },
        });
        return access;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Log agent in and return access token
   * @returns access token or null if agent login is under way
   */
  async login(): Promise<string | null> {
    const agent = await this.fetchAgentFromDb();
    if (agent && agent.dirty) return null;

    try {
      if (agent) await this.setAgentLoginStatus(true);
      const data = await this.attemptLogin();
      await this.finalizeAgentLogin(data);
      return data.access;
    } catch (error) {
      await this.setAgentLoginStatus(false);
      throw error;
    }
  }

  async authenticate(): Promise<string[] | null> {
    const access = await this.login();
    if (!access) return null;
    return [access];
  }

  private async setAgentLoginStatus(isDirty: boolean): Promise<void> {
    await this.setAgentDirtyFlag(isDirty);
  }

  private async attemptLogin(): Promise<LoginResponse> {
    const agentLoginUrl = "/accounts/login/";
    const response = await new HttpService().plainAgentApi.post(
      agentLoginUrl,
      await this.loginDetails(),
    );

    if (response.status !== 200) {
      throw new CustomError({
        status: response.status,
        code: "agent_api_error",
        description: "Error en el panel al loguear al agente",
        detail: response.data,
      });
    }

    return response.data;
  }

  private async finalizeAgentLogin(data: LoginResponse): Promise<void> {
    await this.updateAgent(data);
    this._token = data.access;
  }

  private setAgentDirtyFlag(dirty: boolean) {
    if (dirty) this._token = undefined;
    return CashierDAO.update({ where: { id: this.agent.id }, data: { dirty } });
  }

  private updateAgent(data: LoginResponse) {
    return CashierDAO.update({
      where: { id: this.agent.id },
      data: {
        access: data.access,
        refresh: data.refresh,
        panel_id: data.id,
        dirty: false,
      },
    });
  }

  private fetchAgentFromDb() {
    return CashierDAO.findFirst({ where: { id: this.agent.id } });
  }
}
