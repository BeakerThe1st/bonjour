import { Message } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent("messageCreate", (message: Message) => {
  if (message.author.id === "754983736705286186") {
    message.react("👀");
  }
});
