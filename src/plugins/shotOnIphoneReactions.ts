import { Message } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent("messageCreate", async (message: Message) => {
  const shotOnIphoneChannel = "780706842383745034";
  if (message.channelId !== shotOnIphoneChannel) {
    return;
  }
  const numberOfImages = message.attachments.filter((attachment) => {
    return !!attachment.contentType?.startsWith("image");
  }).size;

  if (numberOfImages < 1 || numberOfImages !== message.attachments.size) {
    try {
      await message.delete();
      const reply = await message.channel.send(
        `${message.author}, please only post images in this channel.`
      );
      setTimeout(() => {
        try {
          reply.delete();
        } catch {
          //ignored
        }
      }, 5000);
    } catch {
      //ignored
    }
    return;
  }
  try {
    await message.react("👍");
    await message.react("❤️");
    await message.react("😮");
  } catch {
    //ignored
  }
});
