import { useCommandRegistry, useEvent } from "..";
import { commandExecutors } from "../hooks/useCommand";
import { Interaction, MessageEmbed } from "discord.js";

useEvent("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  const cmd = useCommandRegistry().getCommands().get(commandName);
  if (!cmd) {
    throw new Error(`${commandName} is not a registered command`);
  }
  await interaction.deferReply({ ephemeral: cmd.ephemeral });
  try {
    const executor = commandExecutors.get(interaction.commandName);
    if (!executor) {
      throw new Error(
        "Tried to call a command that doesn't have a corresponding useCommand hook"
      );
    }
    let response = await executor(interaction);
    if (response instanceof MessageEmbed) {
      response = { embeds: [response] };
    }
    if (response) {
      interaction.editReply(response);
    }
  } catch (error) {
    interaction.editReply(`${error}`);
  }
});
