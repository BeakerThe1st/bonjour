import { MessageEmbed, Util } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "event",
  description: "Displays information about the next Apple event.",
  permissionLevel: 0,
});

Bonjour.useCommand("event", (): Bonjour.CommandResponse => {
  return `There is no planned Apple Event at this time! Stay tuned to <#332310178277883916> for updates.`;
  const event = {
    name: "Peek Performance",
    timestamp: 1646762400000,
    image: "https://i.imgur.com/PLMut3e.png",
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
