import { Message, MessageMentions } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent("messageCreate", (message: Message) => {
  if (message.author.id !== "537861332532461579") {
    return;
  }
  let reply = "dab";
  const { mentions } = message;
  if (message.content.match(MessageMentions.EVERYONE_PATTERN)) {
    reply += "matches regex ";
  }
  if (mentions.everyone) {
    reply += "does actually mention everyone";
  }
  message.reply(reply);
});
