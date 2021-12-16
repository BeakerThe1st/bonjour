import { Client, ClientOptions, IntentsString } from "discord.js";
import { DebugType, useCurrentClient } from ".";
import fs from "fs";
import path from "path";

type InitialisationOptions = ClientOptions & {
  folders: string[];
  baseUrl: string;
  intents: IntentsString[];
  debug: DebugType;
};

class BonjourClient extends Client {
  folders: string[];
  constructor(token: string, options: InitialisationOptions) {
    super(options);

    this.folders = [];

    const { debug: debugType } = options;
    if (debugType !== DebugType.NONE) {
      this.enableDebug(debugType);
    }

    useCurrentClient().setClient(this);

    for (const folder of options.folders) {
      const folderUrl = new URL(folder, options.baseUrl);
      this.loadFiles(folderUrl);
    }
    this.loadFiles(new URL("./defaults", import.meta.url));
    this.login(token);
  }

  async loadFiles(folderUrl: URL) {
    const files = [
      ...fs.readdirSync(folderUrl).map((fileName: string) => {
        return path.join(folderUrl.href, fileName);
      }),
    ];
    for (const file of files) {
      import(file).then(() => {
        this.emit("bonjourDebug", `Loaded ${file}`);
      });
    }
  }

  private enableDebug(type: DebugType) {
    const enableDiscordJsDebug = () => {
      this.on("debug", (message: string) => {
        console.debug(message);
      });
    };
    const enableBonjourDebug = () => {
      this.on("bonjourDebug", (message: string) => {
        console.debug(`[BONJOUR] ${message}`);
      });
    };
    switch (type) {
      case DebugType.ALL:
        enableDiscordJsDebug();
        enableBonjourDebug();
        break;
      case DebugType.BONJOUR:
        enableBonjourDebug();
        break;
      case DebugType.DISCORDJS:
        enableDiscordJsDebug();
        break;
    }
  }
}

export { BonjourClient };
