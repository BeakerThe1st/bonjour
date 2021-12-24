import { Message } from "discord.js";
import * as Bonjour from "../core";
import { google, discovery_v1 } from "googleapis";

Bonjour.useEvent("messageCreate", async (message: Message) => {
  const { PERSPECTIVE_KEY } = process.env;
  if (!PERSPECTIVE_KEY) {
    throw new Error("PERSPECTIVE_KEY undefined");
  }
  if (message.author.id !== "537861332532461579") {
    return;
  }
  /*if (message.member?.roles.cache.has("881503056091557978")) {
    //user is established
    return;
  }*/
  const client = await google.discoverAPI(
    "https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1"
  );
  const resource = {
    comment: {
      text: `${message.content}`,
    },
    requestedAttributes: {
      TOXICITY: {},
      SEVERE_TOXICITY: {},
      IDENTITY_ATTACK: {},
      INSULT: {},
      PROFANITY: {},
      THREAT: {},
      SEXUALLY_EXPLICIT: {},
      FLIRTATION: {},
    },
  };
  (client.comments as any).analyze(
    {
      key: PERSPECTIVE_KEY,
      resource,
    },
    (err: unknown, response: any) => {
      if (err) {
        return;
      }
      message.reply(
        `\`\`\`json\n${JSON.stringify(response.data, null, 2)}\`\`\``
      );
    }
  );
});
