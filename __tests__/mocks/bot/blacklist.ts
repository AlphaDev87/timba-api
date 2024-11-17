import { BotServices } from "@/components/bot/services";

export const mockBlacklist = jest.fn(async () => ({
  status: 200,
}));
export function prepareBotBlacklist() {
  // @ts-ignore
  jest.spyOn(BotServices, "blacklist").mockImplementation(mockBlacklist);
}

export const mockGetBlacklist = jest.fn(async () => []);
export function prepareShowBlacklist() {
  jest.spyOn(BotServices, "showBlacklist").mockImplementation(mockGetBlacklist);
}
