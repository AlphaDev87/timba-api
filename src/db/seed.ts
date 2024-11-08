import { Cashier, Player, PrismaClient } from "@prisma/client";
import readlineSync from "readline-sync";
import CONFIG from "@/config";
import { encrypt, hash } from "@/utils/crypt";
import { CasinoTokenService } from "@/services/casino-token.service";

const prisma = new PrismaClient();

const INTERACTIVE = false;

async function ensureRolesExist() {
  const roles = Object.values(CONFIG.ROLES);
  const dbRoles = await prisma.role.findMany();
  if (dbRoles.length === 0) {
    await prisma.role.createMany({
      data: roles.map((role) => ({ name: role })),
    });
  } else {
    roles.forEach(async (role) => {
      if (dbRoles.some((r) => r.name === role)) return;

      await prisma.role.create({ data: { name: role } });
    });
  }

  console.log("\nRoles OK 👍\n");
}

function requestCasinoCredentials() {
  let casinoUsername = process.env.CASINO_PANEL_USER;
  let casinoPassword = process.env.CASINO_PANEL_PASS;

  if (!INTERACTIVE && (!casinoUsername || !casinoPassword)) {
    console.error(
      "Credenciales del casino no encontradas. " +
        "Asegurate de setear CASINO_PANEL_USER y CASINO_PANEL_PASS en .env",
    );
    process.exit(1);
  }

  if (INTERACTIVE) {
    do {
      casinoUsername = readlineSync.question(
        `Nombre de usuario del agente en el casino [${casinoUsername}]:`,
        {
          defaultInput: casinoUsername,
        },
      );
    } while (!casinoUsername);
    do {
      casinoPassword = readlineSync.question(
        `Contraseña del agente en el casino: [${casinoPassword}]:`,
        {
          defaultInput: casinoPassword,
          hideEchoBack: true,
        },
      );
    } while (!casinoPassword);
  }
  return { casinoUsername, casinoPassword };
}

function requestLocalCredentials() {
  let localUsername = process.env.AGENT_PANEL_USERNAME;
  let localPassword = process.env.AGENT_PANEL_PASSWORD;

  if (!INTERACTIVE && (!localUsername || !localPassword)) {
    console.error(
      "Credenciales del agente no encontradas. " +
        "Asegurate de setear AGENT_PANEL_USERNAME y AGENT_PANEL_PASSWORD en .env",
    );
    process.exit(1);
  }

  if (INTERACTIVE) {
    do {
      localUsername = readlineSync.question(
        `Usuario del agente en panel propio [${localUsername}]:`,
        {
          defaultInput: localUsername,
        },
      );
    } while (!localUsername);
    do {
      localPassword = readlineSync.question(
        `Contraseña del agente en el panel propio: [${localPassword}]:`,
        {
          defaultInput: localPassword,
          hideEchoBack: true,
        },
      );
    } while (!localPassword);
  }
  return { localUsername, localPassword };
}

async function createUserRoot() {
  const { casinoUsername, casinoPassword } = requestCasinoCredentials();

  return await prisma.cashier.create({
    data: {
      username: casinoUsername!,
      password: encrypt(casinoPassword!),
      access: "",
      refresh: "",
      panel_id: -1,
      handle: `${casinoUsername}`,
    },
  });
}

async function updateUserRoot(userRoot: Cashier) {
  const { casinoUsername, casinoPassword } = requestCasinoCredentials();

  return await prisma.cashier.update({
    where: { id: userRoot.id },
    data: {
      username: casinoUsername,
      password: encrypt(casinoPassword!),
    },
  });
}

function requestUserConsent(message: string): boolean {
  const consent = readlineSync.question(`${message} [Y/n]`, {
    defaultInput: "y",
  });
  return consent.toLowerCase() === "y";
}

async function upsertUserRoot(): Promise<Cashier> {
  const agent = await prisma.player.findFirst({
    where: { roles: { every: { name: CONFIG.ROLES.AGENT } } },
    select: { Cashier: true },
  });
  let userRoot = agent?.Cashier;
  if (!userRoot) {
    userRoot = await createUserRoot();
  } else {
    const update =
      !INTERACTIVE || requestUserConsent("User root ya existe, actualizar?");
    if (update) userRoot = await updateUserRoot(userRoot);
  }

  const casinoTokenService = new CasinoTokenService(userRoot);
  await casinoTokenService.login();

  console.log("\nUser root OK 👍\n");
  return userRoot;
}

async function createAgent(userRoot: Cashier) {
  const { localUsername, localPassword } = requestLocalCredentials();

  const agent = await prisma.player.create({
    data: {
      username: localUsername!,
      password: await hash(localPassword!),
      panel_id: userRoot.panel_id!,
      roles: {
        connectOrCreate: {
          where: { name: CONFIG.ROLES.AGENT },
          create: { name: CONFIG.ROLES.AGENT },
        },
      },
      email: "agent@example.com",
      cashier_id: userRoot.id,
    },
  });

  await prisma.agentConfig.create({ data: { player_id: agent.id } });
}

async function updateAgent(agent: Player, userRoot: Cashier) {
  const { localUsername, localPassword } = requestLocalCredentials();

  await prisma.player.update({
    where: { id: agent.id },
    data: {
      username: localUsername,
      password: await hash(localPassword!),
      panel_id: userRoot.panel_id!,
      cashier_id: userRoot.id,
    },
  });
}

async function upsertAgent(userRoot: Cashier) {
  const agent = await prisma.player.findFirst({
    where: { roles: { some: { name: CONFIG.ROLES.AGENT } } },
  });

  if (!agent) {
    await createAgent(userRoot);
  } else {
    await prisma.player.update({
      where: { id: agent.id },
      data: { cashier_id: userRoot.id },
    });
    const update =
      !INTERACTIVE ||
      requestUserConsent("Las credenciales del agente ya existen, actualizar?");
    if (update) await updateAgent(agent, userRoot);
  }

  console.log("\nAgente OK 👍\n");
}
async function main() {
  await ensureRolesExist();

  const userRoot: Cashier = await upsertUserRoot();

  await upsertAgent(userRoot);
}

main();
