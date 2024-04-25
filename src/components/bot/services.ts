import CONFIG from "@/config";

export class BotServices {
  static showNames(): string[] {
    const paths = CONFIG.BOT.QR_PATHS.trim().split("\n");
    const names = paths.map((path) => path.split(".")[0].split("/").pop());
    return names as string[];
  }
}
