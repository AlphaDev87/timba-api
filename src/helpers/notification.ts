import { WebPushServices } from "@/components/web-push/services";
import { WebPushPayload } from "@/types/request/web-push";
import { WebPushDAO } from "@/db/web-push";

export class Notify {
  static async agent(payload: WebPushPayload) {
    const webPushServices = new WebPushServices();
    const subscriptions = await webPushServices.index();

    subscriptions.forEach(async (subscription) => {
      try {
        await webPushServices.send(subscription, payload);
      } catch (e: any) {
        if (e.statusCode === 404 || e.statusCode === 410) {
          await WebPushDAO.deleteByEndpoint(e.endpoint);
        }
      }
    });
  }
}
