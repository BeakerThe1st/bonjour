import { Message } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent("messageCreate", async (message: Message) => {
  if (message.author.id === "754983736705286186") {
    await message.react("👀");
  }
});
