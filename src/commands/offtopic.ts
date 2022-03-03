import * as Bonjour from "../core";
import { CommandInteraction, TextChannel } from "discord.js";

const images = [
  "https://i.imgur.com/A6AoUYI.gif",
  "https://i.imgur.com/Hf7gnSt.gif",
  "https://i.imgur.com/LrBO86i.gif",
  "https://i.imgur.com/82FuJgL.gif",
  "https://i.imgur.com/St4dtQp.gif",
  "https://i.imgur.com/PNrFFOV.gif",
  "https://imgur.com/x6dpGxf",
];

const registry = Bonjour.useCommandRegistry();

registry.register({
  name: "offtopic",
  description: "Nicely ask users to move to lounge.",
  ephemeral: true,
  permissionLevel: 0,
});

Bonjour.useCommand(
  "offtopic",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const imageUrl = images[Math.floor(Math.random() * images.length)];

    const offTopicChannel = await interaction.client.channels.fetch(
      "911959817315295252"
    );
    if (!(offTopicChannel instanceof TextChannel)) {
      throw new Error("The off topic channel is not a valid text channel.");
    }

    if (interaction.channelId === offTopicChannel.id) {
      return `Nice try 😉`;
    }

    const { channel, user } = interaction;
    if (!channel) {
      throw new Error("That command must be run in a channel.");
    }

    const reminderMessage = await channel.send({
      embeds: [
        {
          title: "Please move off topic conversation.",
          description: `Please move to ${offTopicChannel.name}. ${offTopicChannel}`,
          color: "GREEN",
          image: {
            url: imageUrl,
          },
        },
      ],
    });
    try {
      const logChannel = await interaction.client.channels.fetch(
        "800938251145314334"
      );
      if (logChannel?.isText()) {
        logChannel.send({
          embeds: [
            {
              title: "Off Topic Conversation Reported",
              url: reminderMessage.url,
              description: `${user} used the off-topic command in ${interaction.channel}`,
              color: "PURPLE",
            },
          ],
        });
      }
    } catch {
      throw new Error(`Unable to log use of offtopic command.`);
    }

    return `Successfully sent the off topic reminder prompt.`;
  }
);
