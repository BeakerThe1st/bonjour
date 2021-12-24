/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Message } from "discord.js";
import * as Bonjour from "../core";
import { useCurrentClient } from "../core";

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
    ...(notEstablished ? ["SEVERE_TOXICITY"] : [""]),
  ];
  if (!flags.some(([key]) => flagsOfConcern.includes(key))) {
    console.log("did not match any");
    return;
  }
  let muted = false;
  if (notEstablished) {
    try {
      await message.delete();
      message = await message.channel.send(
        `Message removed as a precaution. Awaiting moderator review.`
      );
      const role = await member.guild.roles.fetch("468957856855621640");
      if (!role) {
        throw new Error();
      }
      await member.roles.add(role);
      muted = true;
    } catch {
      await message.reply("oh no");
      //ignored
    }
  }
  const staffQueue = await useCurrentClient().client.channels.fetch(
    "922279194015174656"
  );
  if (!staffQueue || !staffQueue.isText()) {
    throw new Error("Staff queue not configured correctly.");
  }
  await staffQueue.send({
    embeds: [
      {
        title: `Automated Report`,
        description: `Message by ${member} flagged in ${message.channel}. [🔗](${message.url}`,
        fields: [
          {
            name: "Content",
            value: `${message.content}`,
          },
          {
            name: "Flags",
            value: `${flags}`,
          },
        ],
        footer: {
          text: `User was ${muted ? "muted indefinitely" : "not muted"}.`,
        },
      },
    ],
    components: [
      {
        type: "ACTION_ROW",
        components: [
          {
            type: "BUTTON",
            customId: `perspective-accept-${member.id}`,
            style: "PRIMARY",
            label: muted ? "Keep muted" : "Mute user",
          },
          {
            type: "BUTTON",
            customId: `perspective-deny-${member.id}`,
            style: "PRIMARY",
            label: muted ? "Unmute" : "Ignore",
          },
        ],
      },
    ],
  });
});
