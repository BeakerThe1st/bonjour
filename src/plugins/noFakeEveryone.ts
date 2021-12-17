import { Message, MessageMentions } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent("messageCreate", (message: Message) => {
  let reply = "";
  const { mentions } = message;
  if (message.content.match(MessageMentions.EVERYONE_PATTERN)) {
    reply += "matches regex for everyone/here - ";
  }
  if (mentions.everyone) {
    reply += "mentions everyone/here";
  }
  if (reply.length > 0) {
    message.reply(reply);
  }
});
