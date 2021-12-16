import { CommandInteraction } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "report",
  description: "Reports DM Spam",
  ephemeral: true,
  options: [
    {
      name: "user",
      description: "User to report.",
      type: "USER",
      required: true,
    },
  ],
  permissionLevel: 0,
});

Bonjour.useCommand(
  "report",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const user = interaction.options.getUser("user", true);
    try {
      const logChannel = await interaction.client.channels.fetch(
        "800938251145314334"
      );
      if (logChannel?.isText()) {
        logChannel.send({
          embeds: [
            {
              title: "Spam Report",
              description: `${interaction.user} reported ${user} for DM spam.`,
              color: "RED",
            },
          ],
        });
      }
    } catch {
      //ignored
    }
    return `Thanks for reporting ${user}. Your report has been received and will be reviewed by the moderation team.`;
  }
);
