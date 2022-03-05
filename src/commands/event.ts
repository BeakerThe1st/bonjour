import { MessageEmbed } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "event",
  description: "Displays information about the next Apple event.",
  permissionLevel: 0,
});

Bonjour.useCommand("event", (): Bonjour.CommandResponse => {
  const event = {
    name: "Peek Performance",
    timestamp: 1646762400000,
    image: "https://i.imgur.com/PLMut3e.png",
  };
  const afterEvent = Date.now() > event.timestamp;
  const embed = new MessageEmbed({
    title: `${event.name}`,
    description: `Apple's ${event.name} event ${
      afterEvent ? "started" : "starts"
    } at <t:${event.timestamp}>`,
    color: "#1afefd",
    thumbnail: {
      url: event.image,
    },
    fields: [
      {
        name: "Time to Event",
        value: `Event ${afterEvent ? "began" : "begins"} <t:${
          event.timestamp / 1000
        }:R>`,
      },
    ],
    footer: {
      text: `All times shown in your local time zone.`,
    },
  });
  return embed;
});
