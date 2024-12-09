import { DepositSSE } from "@/components/deposits/sse";
import { Telegram } from "@/notification/telegram";

export const mockNotifDepositStatus = jest.fn();
export const mockDispatchDepositEvent = jest.fn();

export function prepareDepositTest() {
  jest.spyOn(Telegram, "arturito").mockImplementation(mockNotifDepositStatus);
  jest
    .spyOn(DepositSSE.eventTarget, "dispatchEvent")
    .mockImplementation(mockDispatchDepositEvent);
}
