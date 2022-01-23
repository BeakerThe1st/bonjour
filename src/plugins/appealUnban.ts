import { Interaction, Message } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isButton()) {
    return;
  }
  const { customId } = interaction;
  const [interactionType, action, userId] = customId.split("-");
  if (interactionType !== "appeal") {
    return;
  }
  if (action !== "unban") {
    return;
  }
  await interaction.deferReply();
  const { client } = Bonjour.useCurrentClient();
  try {
    const rApple = await client.guilds.fetch("332309672486895637");
    await rApple.bans.remove(userId);
    interaction.editReply(`Unbanned <@${userId}>`);
  } catch {
    interaction.reply("Could not unban user");
    return;
  }
  const { message } = interaction;
  if (message instanceof Message) {
    await message.edit({
      content: `<@${userId}> unbanned by ${interaction.user}.`,
      components: [],
    });
  }
});
