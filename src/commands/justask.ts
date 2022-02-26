import { CommandInteraction } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "justask",
  description: "Don't ask to ask, just ask",
  ephemeral: false,
  permissionLevel: 20,
});

Bonjour.useCommand(
  "justask",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const message =
      '**Please don\'t ask to ask, just ask.**\nFor example, instead of saying "can someone pls help me with me with muh iphone???", say "My iPhone 13 mini won\'t turn on, can anyone help?".\nhttps://dontasktoask.com/';
    await interaction.channel?.send({
      content: message,
    });
    return `${interaction.user} used the the justask prompt in ${interaction.channel}.`;
  }
);
