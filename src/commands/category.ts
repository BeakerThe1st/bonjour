import { CommandInteraction } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "category",
  description: "Manages a channel category.",
  permissionLevel: 50,
  options: [
    {
      name: "open",
      description: "Opens a category.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "category",
          description: "The category to open.",
          type: "CHANNEL",
          required: true,
        },
      ],
    },
    {
      name: "close",
      description: "Closes a category.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "category",
          description: "The category to close.",
          type: "CHANNEL",
          required: true,
        },
      ],
    },
  ],
});

Bonjour.useCommand(
  "category",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const category = interaction.options.getChannel("category", true);
    const isOpening = interaction.options.getSubcommand() === "open";
    if (category.type !== "GUILD_CATEGORY") {
      throw new Error(`<#${category.id}> is not a category.`);
    }
    const unlockedChildChannels = Array.from(category.children.values()).filter(
      (channel) => {
        return !channel.permissionsLocked;
      }
    );
    await category.permissionOverwrites.edit("332309672486895637", {
      VIEW_CHANNEL: isOpening,
      CONNECT: isOpening,
    });
    return `<#${category.id}> is now ${isOpening ? "open" : "closed"}.${
      unlockedChildChannels
        ? `\nPlease note that \`${unlockedChildChannels.join(
            ", "
          )}\` were not synced with the category and may have not been affected.`
        : ""
    }`;
  }
);
