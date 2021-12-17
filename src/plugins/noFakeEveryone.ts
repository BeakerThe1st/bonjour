import { Message, MessageMentions } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent("messageCreate", async (message: Message) => {
  const { mentions } = message;
  if (!message.content.match(MessageMentions.EVERYONE_PATTERN)) {
    return;
  }
  if (mentions.everyone) {
    return;
  }
  try {
    await message.delete();
    const reply = await message.channel.send(
      `${message.author}, please do not attempt to ping everyone/here!`
    );
    setTimeout(async () => {
      try {
        await reply.delete();
      } catch {
        //ignored
      }
    }, 5000);
  } catch {
    //ignored
  }
});
