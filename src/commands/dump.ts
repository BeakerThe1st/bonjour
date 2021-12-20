import { CommandInteraction } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "dump",
  description: "Data dump.",
  options: [
    {
      type: "SUB_COMMAND",
      name: "user",
      description: "Data dump a user.",
      options: [
        {
          type: "USER",
          name: "user",
          description: "User to data dump.",
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "channel",
      description: "Data dump a channel.",
      options: [
        {
          type: "CHANNEL",
          name: "channel",
          description: "Channel to data dump.",
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "role",
      description: "Data dump a role",
      options: [
        {
          type: "ROLE",
          name: "role",
          description: "Role to data dump.",
          required: true,
        },
      ],
    },
  ],
  permissionLevel: 50,
});

Bonjour.useCommand(
  "dump",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const { options } = interaction;
    const subcommand = options.getSubcommand();
    const object = (() => {
      switch (subcommand) {
        case "user":
          return options.getUser("user", true);
        case "channel":
          return options.getChannel("channel", true);
        case "role":
          return options.getRole("role", true);
      }
    })();
    return `\`\`\`json\n${JSON.stringify(object, null, 2)}\n\`\`\``;
  }
);
