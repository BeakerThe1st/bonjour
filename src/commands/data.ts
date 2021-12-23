import { CommandInteraction } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "data",
  description: "Displays data.",
  options: [
    {
      type: "SUB_COMMAND",
      name: "user",
      description: "Displays user data.",
      options: [
        {
          type: "USER",
          name: "user",
          description: "User to display data for.",
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "channel",
      description: "Displays channel data.",
      options: [
        {
          type: "CHANNEL",
          name: "channel",
          description: "Channel to display data for.",
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "role",
      description: "Displays role data.",
      options: [
        {
          type: "ROLE",
          name: "role",
          description: "Role to display data for.",
          required: true,
        },
      ],
    },
  ],
  permissionLevel: 50,
});

Bonjour.useCommand(
  "data",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const { options } = interaction;
    const subcommand = options.getSubcommand();
    const object = await (async () => {
      switch (subcommand) {
        case "user": {
          const user = options.getUser("user", true);
          try {
            const member = await interaction.guild?.members.fetch(user);
            return { user, member };
          } catch {
            return { user };
          }
        }
        case "channel":
          return options.getChannel("channel", true);
        case "role":
          return options.getRole("role", true);
      }
    })();
    return `\`\`\`json\n${JSON.stringify(object, null, 2)}\n\`\`\``;
  }
);
