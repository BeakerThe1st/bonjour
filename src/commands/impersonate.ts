import { CommandInteraction, TextChannel } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "impersonate",
  description: "Impersonates a given user",
  ephemeral: true,
  options: [
    {
      name: "user",
      description: "User to impersonate",
      type: "USER",
      required: true,
    },
    {
      name: "message",
      description: "Message to send",
      type: "STRING",
      required: true,
    },
  ],
  permissionLevel: 50,
});

Bonjour.useCommand(
  "impersonate",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const user = interaction.options.getUser("user", true);
    const message = interaction.options.getString("message", true);
    const { channel } = interaction;
    if (!channel || !(channel instanceof TextChannel)) {
      throw new Error("Must be run in a text channel");
    }
    const webhook = await channel.createWebhook(user.username, {
      avatar: user.displayAvatarURL(),
    });
    await webhook.send(message);
    await webhook.delete();
    return `Successfully impersonated ${user.username}!`;
  }
);
