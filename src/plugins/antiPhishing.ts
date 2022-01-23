import * as Bonjour from "../core";
import stopPhishing from "stop-discord-phishing";
import { Message } from "discord.js";

Bonjour.useEvent("messageCreate", async (message: Message) => {
  const { content } = message;
  if (await stopPhishing.checkMessage(content)) {
    await message.delete();
    const reply = await message.channel.send(
      `${message.author}, please do not send phishing links!`
    );
    setTimeout(() => {
      try {
        reply.delete();
      } catch {
        //ignored
      }
    }, 5000);
  }
});
