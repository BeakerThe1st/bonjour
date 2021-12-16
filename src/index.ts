import "./env";
import { BonjourClient, DebugType, useCurrentClient } from "./bonjour";
import mongoose from "mongoose";
import { usePermissions } from "./bonjour/hooks/usePermissions";

const { DISCORD_TOKEN, MONGO_URI } = process.env;
if (!DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN undefined.");
}

if (!MONGO_URI) {
  throw new Error("MONGO_URI undefined.");
}

await mongoose.connect(MONGO_URI).catch(() => {
  throw new Error("Unable to connect to mongo");
});
const userGroups = new Map<string, number>();

userGroups.set("334889501874978817", 100); // Admins
userGroups.set("334889410006876161", 50); // r/Apple ModSquad
userGroups.set("334888870955188235", 30); // Support Enthusiasts
userGroups.set("338950814108483586", 20); // Plus

const client = new BonjourClient(DISCORD_TOKEN, {
  intents: ["GUILDS"],
  baseUrl: import.meta.url,
  folders: ["./plugins", "./commands"],
  debug: DebugType.BONJOUR,
  presence: {
    status: "online",
    activities: [
      {
        name: "r/Apple.",
        type: "COMPETING",
      },
    ],
  },
});

client.on("commandsRegistered", async () => {
  try {
    const rApple = await useCurrentClient().client.guilds.fetch(
      "332309672486895637"
    );
    usePermissions(rApple).update(userGroups);
  } catch {
    console.log("Unable to update permissions in r/Apple");
  }
});
