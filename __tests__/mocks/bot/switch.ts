import { BotServices } from "@/components/bot/services";
import { GLOBAL_SWITCH_STATE } from "@/config";

export const mockSwitch = jest.fn(async () => ({
  status: 200,
}));
export function prepareBotSwitchTest() {
  // @ts-ignore
  jest.spyOn(BotServices, "switch").mockImplementation(mockSwitch);
}

export const mockGetSwitch = jest.fn(async () => GLOBAL_SWITCH_STATE.ON);
export function prepareGetBotSwitchTest() {
  jest.spyOn(BotServices, "showSwitchState").mockImplementation(mockGetSwitch);
}
