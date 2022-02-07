import { Message } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent("messageCreate", (message: Message) => {
  if (message.author.id !== "195531486638637056") {
    //jacktheaussie
    return;
  }
  message.react("🤡");
});
