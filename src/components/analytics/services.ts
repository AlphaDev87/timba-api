import { AnalyticsDAO } from "@/db/analytics";
import { ResourceService } from "@/services/resource.service";

export class AnalyticsServices extends ResourceService {
  constructor() {
    super(AnalyticsDAO);
  }
}
