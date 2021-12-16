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
    await interaction.channel?.send(
      `${
        interaction.user.id === "537861332532461579"
          ? ""
          : `[${interaction.user}]: `
      }${message}`
    );
    return `Said \`${message}\` in ${interaction.channel}`;
  }
);
