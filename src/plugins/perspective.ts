/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Guild, GuildMember, Interaction, Message } from "discord.js";
import * as Bonjour from "../core";
import { useCurrentClient } from "../core";

const getMutedRole = async (guild: Guild) => {
  const role = await guild.roles.fetch("468957856855621640");
  if (!role) {
    throw new Error("Muted role not found.");
  }
  return role;
};

const muteMemberForSixHours = async (member: GuildMember) => {
  const role = await getMutedRole(member.guild);
  if (member.roles.cache.has(role.id)) {
    throw new Error("User is already muted.");
  }
  await member.roles.add(role);
  setTimeout(async () => {
    try {
      await member.roles.remove(role);
    } catch {
      //ignored
    }
  }, 1000 * 60 * 60 * 6);
};

Bonjour.useEvent("messageCreate", async (message: Message) => {
  const { content: text, member } = message;
  if (!text || message.author.bot || !member) {
    return;
  }

  const { PERSPECTIVE_KEY } = process.env;
  if (!PERSPECTIVE_KEY) {
    throw new Error("PERSPECTIVE_KEY undefined");
  }
  const resource = {
    comment: {
      text,
    },
    languages: ["en"],
    requestedAttributes: {
      TOXICITY: {},
      SEVERE_TOXICITY: {},
      IDENTITY_ATTACK: {},
      INSULT: {},
      PROFANITY: {},
      THREAT: {},
    },
  };
  const res = await axios.post(
    "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze",
    resource,
    {
      params: { key: PERSPECTIVE_KEY },
    }
  );
  const flags = Object.entries(res.data.attributeScores)
    .filter(([, value]) => (value as any).summaryScore.value > 0.85)
    .map(([key, value]) => [key, (value as any).summaryScore.value]);
  if (message.channelId === "923758797149831178") {
    await message.reply(
      flags.length > 0
        ? `\`\`\`json\n${JSON.stringify(flags)}\`\`\``
        : `No flags found!`
    );
    return;
  }
  const notEstablished = !member.roles.cache.has("881503056091557978");
  const flagsOfConcern = [
    "IDENTITY_ATTACK",
    ...(notEstablished ? ["SEVERE_TOXICITY"] : []),
  ];
  if (!flags.some(([key]) => flagsOfConcern.includes(key))) {
    return;
  }
  let muted = false;
  if (notEstablished) {
    try {
      await message.delete();
      await message.channel.send(
        `Message removed as a precaution. Awaiting moderator review.`
      );
      muteMemberForSixHours(member);
      muted = true;
    } catch {
      //ignored
    }
  }
  const staffQueue = await useCurrentClient().client.channels.fetch(
    "476924704528138271"
  );
  if (!staffQueue || !staffQueue.isText()) {
    throw new Error("Staff queue not configured correctly.");
  }
  await staffQueue.send({
    embeds: [
      {
        title: `Automated Report`,
        description: `Message by ${member} flagged in ${message.channel}${
          !message.deleted ? `\n🔗 [Link to Message](${message.url})` : ""
        }`,
        color: "BLUE",
        fields: [
          {
            name: "Content",
            value: text,
          },
        ],
        footer: {
          text: `User was ${muted ? "muted for 6 hours" : "not muted"}.`,
        },
      },
    ],
    components: [
      {
        type: "ACTION_ROW",
        components: [
          {
            type: "BUTTON",
            customId: `perspective-accept-${member.id}-${
              muted ? "true" : "false"
            }`,
            style: "SUCCESS",
            label: muted ? "Keep muted" : "Mute user",
          },
          {
            type: "BUTTON",
            customId: `perspective-deny-${member.id}-${
              muted ? "true" : "false"
            }`,
            style: "DANGER",
            label: muted ? "Unmute" : "Ignore",
          },
        ],
      },
    ],
  });
});

Bonjour.useEvent("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isButton()) {
    return;
  }
  const { customId, message, guild } = interaction;
  if (!guild || !(message instanceof Message)) {
    return;
  }
  const [oldEmbed] = message.embeds;
  const [interactionType, action, userId, actioned] = customId.split("-");
  if (interactionType !== "perspective") {
    return;
  }
  await interaction.deferReply({ ephemeral: true });
  let target;
  try {
    target = await guild.members.fetch(userId);
  } catch {
    await interaction.editReply(`<@${userId}> is no longer in the guild.`);
    return;
  }

  if (action === "deny") {
    //negative action
    if (actioned === "true") {
      await target.roles.remove(await getMutedRole(guild));
    }
    await interaction.editReply(
      actioned ? `${target} unmuted.` : `Successfully ignored report.`
    );
    await message.delete();
  } else {
    //positive action
    if (actioned === "false") {
      await muteMemberForSixHours(target);
    }
    await interaction.editReply(
      actioned ? `Verified mute for ${target}.` : `Muted ${target} for 6 hours.`
    );
    await message.edit({
      embeds: [
        {
          title: actioned ? `User mute verified.` : `User muted.`,
          description: `${interaction.member} has ${
            actioned ? `verified a mute on` : `muted`
          } ${target}${actioned ? " for 6 hours." : ""}.`,
          color: "RED",
          fields: oldEmbed.fields,
        },
      ],
      components: [],
    });
  }
});
