import { Message } from "discord.js";
import Tesseract from "tesseract.js";
import * as Bonjour from "../core";

Bonjour.useEvent("messageCreate", async (message: Message) => {
  const { attachments } = message;
  if (attachments.size < 1) {
    return;
  }
  console.log(`Attachments from ${message.author.tag}`);
  let containsBadWord = false;
  for (const [id, attachment] of attachments) {
    try {
      const result = await Tesseract.recognize(attachment.url, "eng");
      console.log(result);
      if (result.data.text.includes("retard")) {
        containsBadWord = true;
        break;
      }
    } catch (error) {
      console.log(error);
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
