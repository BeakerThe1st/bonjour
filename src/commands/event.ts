import { MessageEmbed, Util } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "event",
  description: "Displays information about the next Apple event.",
  permissionLevel: 0,
});

Bonjour.useCommand("event", (): Bonjour.CommandResponse => {
  const event = {
    name: "Far Out",
    timestamp: 1662570000000,
    image: "https://i.imgur.com/KvnBbmU.png",
  };
  const afterEvent = Date.now() > event.timestamp;
  const discordTimestamp = event.timestamp / 1000;
  const embed = new MessageEmbed({
    title: `${event.name}`,
    description: `Apple's ${event.name} event ${
      afterEvent ? "started" : "starts"
    } at <t:${discordTimestamp}>`,
    color: Util.resolveColor("#1afefd"),
    thumbnail: {
      url: event.image,
    },
    fields: [
      {
        name: "Time to Event",
        value: `Event ${
          afterEvent ? "began" : "begins"
        } <t:${discordTimestamp}:R>`,
      },
    ],
    footer: {
      text: `All times shown in your local time zone.`,
    },
  });
  return embed;
});
