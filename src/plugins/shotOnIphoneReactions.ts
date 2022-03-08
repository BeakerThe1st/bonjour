import { Message } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent("messageCreate", async (message: Message) => {
  const shotOnIphoneChannel = "780706842383745034";
  if (message.channelId !== shotOnIphoneChannel) {
    return;
  }

  if (message.author.id === Bonjour.useCurrentClient().client.user?.id) {
    return;
  }

  const numberOfImages = message.attachments.filter((attachment) => {
    return !!attachment.contentType?.startsWith("image");
  }).size;

  if (numberOfImages < 1 || numberOfImages !== message.attachments.size) {
    await message.delete();
    const reply = await message.channel.send(
      `${message.author}, please only post images in this channel.`
    );
    setTimeout(async () => {
      try {
        await reply.delete();
      } catch {
        //ignored
      }
    }, 5000);
    return;
  }
  await message.react("👍");
  await message.react("❤️");
  await message.react("😲");
});
