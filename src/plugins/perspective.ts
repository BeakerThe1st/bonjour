/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Message } from "discord.js";
import * as Bonjour from "../core";

type PerspectiveScores = {
  TOXICITY?: string;
  SEVERE_TOXICITY?: string;
  IDENTITY_ATTACK?: string;
  INSULT?: string;
  PROFANITY?: string;
  THREAT?: string;
};

Bonjour.useEvent("messageCreate", async (message: Message) => {
  const { content: text } = message;
  if (!text || message.author.bot) {
    return;
  }
  if (message.channelId !== "923758797149831178") {
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
  const scores: PerspectiveScores = {};
  for (const [key, value] of Object.entries(res.data.attributeScores).sort()) {
    const percent = Math.round((value as any).summaryScore.value * 1000) / 10;
    scores[key as keyof PerspectiveScores] = `${percent}%`;
  }
  message.reply(`\`\`\`json\n${JSON.stringify(scores, null, 2)}\`\`\``);
  if (message.member?.roles.cache.has("881503056091557978")) {
    //user is established
    return;
  }
});
