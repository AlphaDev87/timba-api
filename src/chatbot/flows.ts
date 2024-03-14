import { addKeyword, EVENTS, IMethodsChain } from "@bot-whatsapp/bot";
import { signUp } from "./dynamic-messages/signUp";
import { deposit } from "./dynamic-messages/deposit";
import { cashout } from "./dynamic-messages/cashout";
import { aboutUs } from "./dynamic-messages/aboutUs";
import { other } from "./dynamic-messages/other";

const resetTimeout = async (
  state: any,
  gotoFlow: (flow: any) => Promise<void>,
) => {
  const IDLE_TIMEOUT = 300000;
  let timeoutId = state.getMyState()?.timeoutId;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => gotoFlow(timeoutFlow), IDLE_TIMEOUT);
  await state.update({ timeoutId });
};

const welcomeFlow: IMethodsChain = addKeyword(EVENTS.WELCOME)
  .addAnswer([
    "Hola 😃",
    "",
    "Bienvenido/a a *CASINO-MEX.COM* 🎰",
    "La plataforma de apuestas en línea más grande y segura de México 🇲🇽",
    "",
    "*OPEN LAS 24HS*",
  ])
  .addAnswer(
    [
      "Apuesta, diviértete y *gana* con:",
      "",
      "🎰 *Slots / Tragamonedas*",
      "⚽ *Apuestas Deportivas*",
      "⭕ *Ruleta*",
      "♠ *Poker*",
      "♦ *Blackjack*",
      "➕ ¡Y muchos otros juegos mas!",
    ],
    {},
    async (_ctx, { gotoFlow, state }) => {
      // await state.update({ resetTimeout: botTimeoutManager(state, gotoFlow) });
      await resetTimeout(state, gotoFlow);
      await gotoFlow(mainMenuFlow);
    },
  );

const mainMenuFlow: IMethodsChain = addKeyword("menu")
  .addAnswer([
    "¿Con cual de estos temas podemos ayudarte?",
    "",
    "*1 - Registro y Cuenta*",
    "*2 - Carga de Creditos*",
    "*3 - Retiro de Dinero*",
    "*4 - Acerca de Nosotros*",
    "*5 - Otras consultas*",
    "",
    "_(Elige un numero)_",
  ])
  .addAction({ capture: true }, async (ctx, { gotoFlow, fallBack, state }) => {
    // const myState = state.getMyState();
    // myState?.resetTimeout() ??
    //   (await state.update({
    //     resetTimeout: botTimeoutManager(state, gotoFlow),
    //   }));
    await resetTimeout(state, gotoFlow);
    switch (ctx.body) {
      case "1":
        await gotoFlow(signupFlow);
        break;
      case "2":
        await gotoFlow(depositFlow);
        break;
      case "3":
        await gotoFlow(cashoutFlow);
        break;
      case "4":
        await gotoFlow(aboutUsFlow);
        break;
      case "5":
        await gotoFlow(otherFlow);
        break;
      default:
        fallBack("Opción inválida. Intenta de nuevo.");
    }
  });

const signupFlow: IMethodsChain = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "👤 *REGISTRO Y CUENTA*",
    "",
    "*1 - ¿Cómo me registro?*",
    "*2 - ¿Mis datos están protegidos?*",
    "*3 - ¿Que pasa si olvido mi contraseña?*",
    "*4 - ¿Volver atras?*",
    "",
    "_(Elige un numero)_",
  ],
  {
    capture: true,
  },
  async (ctx, { flowDynamic, fallBack, gotoFlow, state }) => {
    await resetTimeout(state, gotoFlow);
    switch (ctx.body) {
      case "1":
        await flowDynamic(signUp.howTo);
        break;
      case "2":
        await flowDynamic(signUp.dataProtection);
        break;
      case "3":
        await flowDynamic(signUp.forgottenPassword);
        break;
      case "4":
        await gotoFlow(mainMenuFlow);
        break;
      default:
        fallBack("Opción inválida. Intenta de nuevo.");
    }
  },
);

const depositFlow: IMethodsChain = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🎰 *CARGA DE CREDITOS:*",
    "",
    "*1 - ¿Como cargo creditos?*",
    "*2 - ¿Que medio de pago ofrecen?*",
    "*3 - ¿Cual es la carga mínima y máxima de créditos?*",
    "*4 - ¿Cuanto demora la carga de créditos?*",
    "*5 - ¿Cuantas veces puedo cargar créditos?*",
    "*6 - Volver atras*",
    "",
    "_(Elige un numero)_",
  ],
  {
    capture: true,
  },
  async (ctx, { flowDynamic, fallBack, gotoFlow, state }) => {
    await resetTimeout(state, gotoFlow);
    switch (ctx.body) {
      case "1":
        await flowDynamic(deposit.howTo);
        break;
      case "2":
        await flowDynamic(deposit.paymentMethods);
        break;
      case "3":
        await flowDynamic(deposit.minMax);
        break;
      case "4":
        await flowDynamic(deposit.delay);
        break;
      case "5":
        await flowDynamic(deposit.howManyTimes);
        break;
      case "6":
        await gotoFlow(mainMenuFlow);
        break;
      default:
        fallBack("Opción inválida. Intenta de nuevo.");
    }
  },
);

const cashoutFlow: IMethodsChain = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "💰 *RETIRO DE DINERO:*",
    "",
    "*1 - ¿Como retiro mi dinero?*",
    "*2 - ¿Cual es el retiro minimo y máximo?*",
    "*3 - ¿Cuanto demora el retiro?*",
    "*4 - ¿Cuantos retiros puedo realizar?*",
    "*5 - Volver atras*",
    "",
    "_(Elige un numero)_",
  ],
  {
    capture: true,
  },
  async (ctx, { flowDynamic, fallBack, gotoFlow, state }) => {
    await resetTimeout(state, gotoFlow);
    switch (ctx.body) {
      case "1":
        await flowDynamic(cashout.howTo);
        break;
      case "2":
        await flowDynamic(cashout.minMax);
        break;
      case "3":
        await flowDynamic(cashout.delay);
        break;
      case "4":
        await flowDynamic(cashout.howManyTimes);
        break;
      case "5":
        await gotoFlow(mainMenuFlow);
        break;
      default:
        fallBack("Opción inválida. Intenta de nuevo.");
    }
  },
);
const aboutUsFlow: IMethodsChain = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🎰 *ACERCA DE NOSOTROS:*",
    "",
    "*1 - ¿Quienes somos?*",
    "*2 - ¿Que juegos tenemos?*",
    "*3 - ¿Donde nos encontramos?*",
    "*4 - Volver atras*",
    "",
    "_(Elige un numero)_",
  ],
  {
    capture: true,
  },
  async (ctx, { flowDynamic, fallBack, gotoFlow, state }) => {
    await resetTimeout(state, gotoFlow);
    switch (ctx.body) {
      case "1":
        await flowDynamic(aboutUs.whoWeAre);
        break;
      case "2":
        await flowDynamic(aboutUs.games);
        break;
      case "3":
        await flowDynamic(aboutUs.location);
        break;
      case "4":
        await gotoFlow(mainMenuFlow);
        break;
      default:
        fallBack("Opción inválida. Intenta de nuevo.");
    }
  },
);

const otherFlow: IMethodsChain = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🔄 *OTRAS CONSULTAS:*",
    "",
    "*1 - ¿Que sucede si hay un error en un juego?*",
    "*2 - No encuentro una opción para mi consulta*",
    "*3  - Volver atras*",
    "",
    "_(Elige un numero)_",
  ],
  {
    capture: true,
  },
  async (ctx, { flowDynamic, fallBack, gotoFlow, state }) => {
    await resetTimeout(state, gotoFlow);
    switch (ctx.body) {
      case "1":
        await flowDynamic(other.error);
        break;
      case "2":
        await flowDynamic(other.contact);
        break;
      case "3":
        await gotoFlow(mainMenuFlow);
        break;
      default:
        fallBack("Opción inválida. Intenta de nuevo.");
    }
  },
);

const timeoutFlow: IMethodsChain = addKeyword(EVENTS.ACTION).addAnswer(
  `He cerrado tu sesión por inactividad.
Para volver al menú principal escribe "menu".`,
);

export const flows = [
  welcomeFlow,
  mainMenuFlow,
  signupFlow,
  depositFlow,
  cashoutFlow,
  aboutUsFlow,
  otherFlow,
  timeoutFlow,
];
