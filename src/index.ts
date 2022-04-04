import "./env";
import { BonjourClient, DebugType, useCurrentClient } from "./core";
import { usePermissions } from "./core/hooks/usePermissions";

const { DISCORD_TOKEN } = process.env;
if (!DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN undefined.");
}

const userGroups = new Map<string, number>();

userGroups.set("334889501874978817", 100); // Admins
userGroups.set("334889410006876161", 50); // r/Apple ModSquad
userGroups.set("334888870955188235", 30); // Support Enthusiasts
userGroups.set("340485917150150656", 25); // Honorary Members
userGroups.set("338950814108483586", 20); // Plus

userGroups.set("860391662441070592", 50); // Ban appeal server bots role

userGroups.set("338150187983699988", 100); // Staff server admins
userGroups.set("717946983427342396", 50); // Staff server mods

const client = new BonjourClient(DISCORD_TOKEN, {
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "GUILD_MEMBERS",
    "GUILD_MESSAGE_TYPING",
  ],
  baseUrl: import.meta.url,
  folders: ["./plugins", "./commands"],
  debug: DebugType.ALL,
  presence: {
    status: "online",
    activities: [
      {
        name: "on M1 Ultra",
        type: "PLAYING"
      },
    ],
  },
});

client.once("commandsRegistered", async () => {
  try {
    const rApple = await useCurrentClient().client.guilds.fetch(
      "332309672486895637"
    );
    usePermissions(rApple).update(userGroups);
  } catch {
    throw new Error(`Unable to update permissions in r/Apple.`);
  }
});
