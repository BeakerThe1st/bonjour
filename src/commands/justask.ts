import { CommandInteraction } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "justask",
  description: `Sends the "don't ask to ask, just ask" message.`,
  options: [
    {
      name: "user",
      description: "User to mention in the tag.",
      type: "USER",
    },
  ],
  permissionLevel: 20,
});

Bonjour.useCommand(
  "justask",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const { channel } = interaction;
    if (!channel?.isText()) {
      throw new Error("That command must be run in a text channel.");
    }
    const user = interaction.options.getUser("user");
    return `${
      user ? `${user}, \n` : ""
    }**Please don't ask to ask, just ask.**\nFor example, instead of saying "can someone pls help me with me with muh iphone???", say "My iPhone 13 mini won't turn on, can anyone help?".\nhttps://dontasktoask.com/`;
  }
);
