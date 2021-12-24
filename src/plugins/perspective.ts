/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Message } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent("messageCreate", async (message: Message) => {
  const { content: text } = message;
  if (!text || message.author.bot) {
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
    if (flags.length > 0) {
      await message.reply(`\`\`\`json\n${JSON.stringify(flags)}\`\`\``);
    } else {
      await message.reply("No flags found!");
    }
  }
  if (message.member?.roles.cache.has("881503056091557978")) {
    //user is established
    return;
  }
});
