import {
  CommandInteraction,
  MessageActionRow,
  MessageEmbed,
  MessageOptions,
  TextBasedChannel,
} from "discord.js";
import parseDuration from "parse-duration";
import prettyMs from "pretty-ms";

import * as Bonjour from "../core";

interface Event {
  name: string;
  timestamp: number;
  image: string;
  interval: number;
  timer?: NodeJS.Timer;
}

const currentEvent: Event = {
  name: "Peek Performance",
  timestamp: 1646762400000,
  image: "https://i.imgur.com/4auYarH.png",
  interval: 1000 * 5,
};

Bonjour.useCommandRegistry().register({
  name: "eventmode",
  description: "Manages event mode.",
  permissionLevel: 50,
  options: [
    {
      name: "start",
      description: "Starts event mode.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "image_url",
          description: "Image URL for event mode prompt.",
          type: "STRING",
        },
        {
          name: "interval",
          description: "Interval between event mode prompts.",
          type: "STRING",
        },
      ],
    },
    {
      name: "stop",
      description: "Stops event mode.",
      type: "SUB_COMMAND",
    },
    {
      name: "prompt",
      description: "Forces the event mode prompt.",
      type: "SUB_COMMAND",
    },
    {
      name: "set",
      description: "Sets event mode options.",
      type: "SUB_COMMAND_GROUP",
      options: [
        {
          name: "image",
          description: "Sets event mode prompt image.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "image_url",
              description: "Image URL for event mode prompt.",
              type: "STRING",
              required: true,
            },
          ],
        },
        {
          name: "interval",
          description: "Sets interval between event mode prompts.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "interval",
              description: "Interval between event mode prompts.",
              type: "STRING",
              required: true,
            },
          ],
        },
      ],
    },
  ],
});

const createEventModePrompt = (event: Event): MessageOptions => {
  const embed = new MessageEmbed({
    title: `${event.name}`,
    description: `The event ${
      Date.now() > event.timestamp ? "began" : "begins"
    } <t:${event.timestamp / 1000}:R>. Watch at the links below.`,
    image: {
      url: event.image,
    },
    color: "#1afefd",
  });
  const actionRow = new MessageActionRow({
    components: [
      {
        type: "BUTTON",
        label: "Apple Website",
        url: "https://www.apple.com/apple-events/",
        style: "LINK",
      },
      {
        type: "BUTTON",
        label: "YouTube",
        url: "https://youtu.be/CUwg_JoNHpo",
        style: "LINK",
      },
      {
        type: "BUTTON",
        label: "Apply for Early Access",
        url: "https://rapple.xyz/plus-application",
        style: "LINK",
      },
    ],
  });
  return { embeds: [embed], components: [actionRow] };
};

const updatePromptInterval = (interval: number, channel: TextBasedChannel) => {
  const { timer } = currentEvent;
  if (timer) {
    clearInterval(timer);
  }
  currentEvent.interval = interval;
  currentEvent.timer = setInterval(async () => {
    try {
      await channel.send(createEventModePrompt(currentEvent));
    } catch {
      //ignored
    }
  }, interval);
};

Bonjour.useCommand(
  "eventmode",
  (interaction: CommandInteraction): Bonjour.CommandResponse => {
    const subCommandGroup = interaction.options.getSubcommandGroup(false);
    const subCommand = interaction.options.getSubcommand();

    if (subCommandGroup === "set") {
      return handleSet(interaction, subCommand);
    }
    if (subCommand === "start") {
      if (currentEvent.timer) {
        return "Event mode is already running.";
      }
      const image = interaction.options.getString("image_url");
      if (image) {
        currentEvent.image = image;
      }
      if (!interaction.channel) {
        throw new Error("That command may only be run in a channel.");
      }
      const intervalStr = interaction.options.getString("interval");
      const interval = intervalStr
        ? parseDuration(intervalStr)
        : currentEvent.interval;
      updatePromptInterval(interval, interaction.channel);

      return `Started event mode with image ${
        currentEvent.image
      } and interval ${prettyMs(interval)}`;
    } else if (subCommand === "stop") {
      if (!currentEvent.timer) {
        return `Event mode is not running.`;
      }
      clearInterval(currentEvent.timer);
      return `Event mode stopped.`;
    } else {
      return createEventModePrompt(currentEvent);
    }
  }
);

const handleSet = (
  interaction: CommandInteraction,
  subCommand: string
): Bonjour.CommandResponse => {
  if (subCommand === "image") {
    const imageUrl = interaction.options.getString("image_url", true);
    currentEvent.image = imageUrl;
    return `Event mode prompt image set to ${imageUrl}.`;
  } else {
    if (!interaction.channel) {
      throw new Error("That command may only be run in a channel.");
    }
    const intervalStr = interaction.options.getString("interval", true);
    const interval = parseDuration(intervalStr);
    if (currentEvent.timer) {
      updatePromptInterval(interval, interaction.channel);
    } else {
      currentEvent.interval = interval;
    }
    return `Event mode prompt interval set to \`${prettyMs(interval)}\`.`;
  }
};
