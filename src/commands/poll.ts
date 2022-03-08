import {
  CommandInteraction,
  Interaction,
  Message,
  MessageOptions,
  Util,
} from "discord.js";
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
    return getPollMessage(message.id);
  }
);

const getPollMessage = (messageId: string): MessageOptions => {
  const poll = polls.get(messageId);
  if (!poll) {
    throw new Error("Poll does not exist.");
  }
  const voteCounts = Array.from(poll.users.values()).reduce(
    (acc, vote) => {
      return Object.assign(acc, { [vote]: acc[vote] + 1 });
    },
    {
      yes: 0,
      no: 0,
    }
  );
  return {
    embeds: [
      {
        title: `${poll.question}`,
        fields: [
          {
            name: "Yes",
            value: `${voteCounts.yes}`,
            inline: true,
          },
          {
            name: "No",
            value: `${voteCounts.no}`,
            inline: true,
          },
        ],
        color: Util.resolveColor("BLURPLE"),
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
  };
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
  await message.edit(getPollMessage(message.id));
});
