// import { hash } from "crypto";
import axios from "axios";
import CONFIG, { ENVIRONMENTS } from "@/config";
import { logtailLogger } from "@/helpers/loggers";
import { prisma } from "@/prisma";
import { CustomError } from "@/helpers/error/CustomError";
import { cryptoHash } from "@/utils/crypt";

export class Telegram {
  private static readonly TOKEN = CONFIG.EXTERNAL.TELEGRAM_BOT_KEY;
  private static readonly CHAT_ID = CONFIG.EXTERNAL.TELEGRAM_CHAT_ID;

  private static get url() {
    return `https://api.telegram.org/bot${this.TOKEN}/sendMessage`;
  }
  private static get chat_id() {
    if (!this.CHAT_ID)
      throw new CustomError({
        status: 500,
        code: "env",
        description: "env.CHAT_ID not set",
      });
    return this.CHAT_ID;
  }

  static async arturito(message: string) {
    try {
      const isDuplicate = await this.isDuplicate(message);
      if (isDuplicate) return;

      await this.sendMessage(this.url, this.chat_id, message, "MarkdownV2");

      await this.logMessage(message);
    } catch (e) {
      if (CONFIG.LOG.LEVEL === "debug") console.error(e);
      if (CONFIG.APP.ENV === ENVIRONMENTS.PRODUCTION) logtailLogger.warn(e);
    }
  }

  private static sendMessage(
    url: string,
    chat_id: string,
    text: string,
    parse_mode: string,
  ) {
    return axios.post(url, { chat_id, text, parse_mode });
  }

  /**
   * Checks if a message has already been sent
   */
  private static async isDuplicate(message: string): Promise<boolean> {
    const hash = cryptoHash(message);
    const alreadySent = await prisma.depositNotifications.findUnique({
      where: { hash },
    });
    return !!alreadySent;
  }

  private static async logMessage(message: string) {
    const hash = cryptoHash(message);
    await prisma.depositNotifications.create({
      data: {
        hash,
      },
    });
  }
}
