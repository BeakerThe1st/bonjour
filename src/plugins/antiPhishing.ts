import * as Bonjour from "../core";
import axios from 'axios';
import { Message } from "discord.js";

Bonjour.useEvent("messageCreate", async (message: Message) => {
  const { content } = message;
  const domainRegex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g;
  let domain: string;
  let malicious = false;
  try {
    if (domainRegex.exec(content) === null) {
      return;
    };
    domain = domainRegex.exec(content)![0];
    try {
      await axios.get(`https://api.phisherman.gg/v1/domains/` + domain)
        .then(res => {
          malicious = res.data;
      })
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    // ignored
  };
  if (!malicious) {
    return;
  }
  await message.delete();
  const reply = await message.channel.send(
    `${message.author}, please do not send phishing links!`
  );
  setTimeout(async () => {
    try {
      await reply.delete();
    } catch {
      //ignored
    }
  }, 5000);
});
