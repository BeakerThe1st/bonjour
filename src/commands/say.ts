import { CommandInteraction } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "say",
  description: "Make Bonjour say a message.",
  ephemeral: true,
  options: [
    {
      name: "message",
      description: "Message to say.",
      type: "STRING",
      required: true,
    },
  ],
  permissionLevel: 50,
});

Bonjour.useCommand(
  "say",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const message = interaction.options.getString("message", true);
    await interaction.channel?.send({
      content: message,
      allowedMentions: {
        parse: ["users"],
      },
    });
    return `Said \`${message}\` in ${interaction.channel}`;
  }
);
