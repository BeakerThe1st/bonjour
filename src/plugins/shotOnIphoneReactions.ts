import { Message } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent("messageCreate", async (message: Message) => {
  const shotOnIphoneChannel = "780706842383745034";
  if (message.channelId !== shotOnIphoneChannel) {
    return;
  }

  if (message.author.bot) {
    return;
  }

  const { attachments } = message;
  const [images, videos] = ["image", "video"].map((type) => {
    return attachments.filter((attachment) => {
      return !!attachment.contentType?.startsWith(type);
    });
  });

  const allowedAttachmentCount = images.size + videos.size;

  if (
    allowedAttachmentCount < 1 ||
    allowedAttachmentCount !== message.attachments.size
  ) {
    await message.delete();
    const reply = await message.channel.send(
      `${message.author}, please only post images and videos in this channel.`
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
