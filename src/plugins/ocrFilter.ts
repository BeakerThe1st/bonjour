import { Message } from "discord.js";
import Tesseract from "tesseract.js";
import * as Bonjour from "../core";

Bonjour.useEvent("messageCreate", async (message: Message) => {
  const { attachments } = message;
  if (attachments.size < 1) {
    return;
  }
  let containsBadWord = false;
  for (const [id, attachment] of attachments) {
    try {
      const result = await Tesseract.recognize(attachment.url, "eng");
      if (result.data.text.includes("retard")) {
        containsBadWord = true;
        break;
      }
    } catch {
      continue;
    }
  }
  if (containsBadWord) {
    try {
      await message.delete();
      const reply = await message.channel.send(
        `${message.author}, please don't use that word!`
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
  }
});
