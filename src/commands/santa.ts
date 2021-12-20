import {
  CommandInteraction,
  GuildMember,
  Interaction,
  Message,
  MessageEmbed,
} from "discord.js";
import * as Bonjour from "../core";

const santaSquadRole = "922282045223342120";

Bonjour.useCommandRegistry().register({
  name: "santa",
  description:
    "Request SantaSquad role if you have a santa hat in your profile picture.",
  permissionLevel: 0,
  ephemeral: true,
});

Bonjour.useCommand(
  "santa",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const santaChannel = await Bonjour.useCurrentClient().client.channels.fetch(
      "922279194015174656"
    );
    const { member } = interaction;
    if (!santaChannel?.isText() || !(member instanceof GuildMember)) {
      throw new Error();
    }
    if (member.roles.cache.has(santaSquadRole)) {
      return `You already have the SantaSquad role!`;
    }
    await santaChannel.send({
      embeds: [
        {
          title: "SantaSquad Request",
          description: `${member} has requested SantaSquad.`,
          image: {
            url: `${member.displayAvatarURL()}`,
          },
          color: "BLUE",
        },
      ],
      components: [
        {
          type: "ACTION_ROW",
          components: [
            {
              type: "BUTTON",
              customId: `santa-accept-${interaction.user.id}`,
              style: "SUCCESS",
              label: "Accept",
            },
            {
              type: "BUTTON",
              customId: `santa-deny-${interaction.user.id}`,
              label: "Deny",
              style: "DANGER",
            },
          ],
        },
      ],
    });
    return `Merry Christmas! You have successfully requested the SantaSquad role!\nIf you don't have a santa hat in your profile picture, you will be denied.`;
  }
);

Bonjour.useEvent("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isButton()) {
    return;
  }
  const { customId, message, guild } = interaction;
  if (!guild || !(message instanceof Message)) {
    return;
  }
  const [interactionType, action, userId] = customId.split("-");
  const accepted = action === "accept";
  if (interactionType !== "santa") {
    return;
  }
  await interaction.deferReply({ ephemeral: true });
  const target = await guild.members.fetch(userId);
  const image = {
    url: message.embeds[0]?.image?.url ?? target.displayAvatarURL(),
  };
  await message.edit({
    embeds: [
      {
        title: `Member ${accepted ? "Accepted" : "Denied"}`,
        description: `${interaction.user} ${
          accepted ? "accepted" : "denied"
        } ${target} for SantaSquad.`,
        color: accepted ? "GREEN" : "RED",
        image,
      },
    ],
    components: [],
  });
  if (accepted) {
    const role = await guild.roles.fetch(santaSquadRole);
    if (!role) {
      throw new Error("Santa squad role not found.");
    }
    await target.roles.add(role);
  }
  await interaction.editReply(
    `Successfully ${accepted ? "accepted" : "denied"} ${target} for SantaSquad.`
  );
  try {
    await target.send(
      accepted
        ? `You were accepted into SantaSquad! 🎅`
        : `That's not a very festive profile picture! Please ensure you change your profile picture contains a santa hat and reapply with \`/santa\`.\nPlease also note that we judge your profile picture based on when you sent the command, if you have changed it since then, simply reapply.`
    );
  } catch {
    //ignored
  }
});
