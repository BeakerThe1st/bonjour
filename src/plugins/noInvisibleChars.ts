import { Message } from "discord.js";
import * as Bonjour from "../core";

const invisibleChars = [
  "\u2000",
  "\u2001",
  "\u2002",
  "\u2003",
  "\u2004",
  "\u2005",
  "\u2006",
  "\u2007",
  "\u2008",
  "\u2009",
  "\u200A",
  "\u200B",
  "\u200C",
  "\u200D",
  "\u200E",
  "\u200F",
  "\u2060",
  "\u2061",
  "\u2062",
  "\u2063",
  "\u2064",
  "\u2065",
  "\u2066",
  "\u2067",
  "\u2068",
  "\u2069",
  "\u206A",
  "\u206B",
  "\u206C",
  "\u206D",
  "\u206E",
  "\u206F",
  "\u202A",
  "\u202B",
  "\u202C",
  "\u202D",
  "\u202E",
];

Bonjour.useEvent("messageCreate", async (message: Message) => {
  if (message.author.bot) {
    return;
  }
  const { content } = message;
  if (!invisibleChars.some((char) => content.includes(char))) {
    return;
  }
  try {
    await message.delete();
    const reply = await message.channel.send(
      `${message.author}, no invisible characters please.`
    );
    setTimeout(async () => {
      try {
        await reply.delete();
      } catch {
        //ignored
      }
    }, 5000);
  } catch {
    //ignored
  }
});
