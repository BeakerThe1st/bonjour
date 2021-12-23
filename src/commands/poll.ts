import { CommandInteraction, Interaction, Message } from "discord.js";
import * as Bonjour from "../core";

type Poll = {
  question: string;
  users: Map<string, "yes" | "no">;
};
const polls = new Map<string, Poll>();

Bonjour.useCommandRegistry().register({
  name: "poll",
  description: "Creates a poll.",
  options: [
    {
      type: "STRING",
      name: "question",
      description: "The question you want to poll.",
      required: true,
    },
  ],
  permissionLevel: 0,
});

Bonjour.useCommand(
  "poll",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const question = interaction.options.getString("question", true);
    const message = await interaction.fetchReply();
    if (!(message instanceof Message)) {
      throw new Error("Message instanceof APIMessage");
    }
    polls.set(message.id, { question, users: new Map() });
    await updatePollEmbed(message);
    return null;
  }
);

const updatePollEmbed = async (message: Message) => {
  const poll = polls.get(message.id);
  if (!poll) {
    throw new Error("Poll does not exist.");
  }
  let yesTally = 0;
  let noTally = 0;
  for (const [user, vote] of poll.users) {
    if (vote === "yes") {
      yesTally++;
    } else {
      noTally++;
    }
  }
  await message.edit({
    embeds: [
      {
        title: `${poll.question}`,
        fields: [
          {
            name: "Yes",
            value: `${yesTally}`,
            inline: true,
          },
          {
            name: "No",
            value: `${noTally}`,
            inline: true,
          },
        ],
      },
    ],
    components: [
      {
        type: "ACTION_ROW",
        components: [
          {
            type: "BUTTON",
            customId: `poll-yes`,
            style: "SUCCESS",
            label: "Yes",
          },
          {
            type: "BUTTON",
            customId: `poll-no`,
            style: "DANGER",
            label: "No",
          },
        ],
      },
    ],
  });
};

Bonjour.useEvent("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isButton()) {
    return;
  }
  const { customId, message, guild, user } = interaction;
  if (!guild || !(message instanceof Message)) {
    return;
  }
  const [type, action] = customId.split("-");
  if (type !== "poll") {
    return;
  }
  await interaction.deferReply({ ephemeral: true });

  const poll = polls.get(message.id);
  if (!poll) {
    await interaction.editReply("That poll can no longer be found.");
    return;
  }

  const previousVote = poll.users.get(user.id);
  if (previousVote === action) {
    poll.users.delete(user.id);
    await interaction.editReply(`Successfully removed your vote.`);
  } else {
    poll.users.set(user.id, action as "yes" | "no");
    await interaction.editReply(`Successfully voted ${action}.`);
  }
  polls.set(message.id, poll);
  await updatePollEmbed(message);
});
