import * as Bonjour from "../core";
import { CommandInteraction, Message, PartialMessage } from "discord.js";

const deletionCache = new Map<string, Message | PartialMessage>();

Bonjour.useEvent("messageDelete", (message: Message | PartialMessage) => {
  const { channelId } = message;
  deletionCache.set(channelId, message);
  setTimeout(() => {
    if (deletionCache.get(channelId) === message) {
      deletionCache.delete(channelId);
    }
  }, 10000);
});

Bonjour.useCommandRegistry().register({
  name: "snipe",
  description: "Snipes a recently deleted message.",
  permissionLevel: 20,
});

Bonjour.useCommand(
  "snipe",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const message = deletionCache.get(interaction.channelId);
    if (!message) {
      return `Too slow! No message has been deleted in the last 10 seconds.`;
    } else {
      return {
        content: `🔫 ${message.author} said: ${message.content}`,
        allowedMentions: {
          parse: [],
        },
      };
    }
  }
);
