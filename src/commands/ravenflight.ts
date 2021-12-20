import { CommandInteraction, TextChannel } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "ravenflight",
  description: "Harass ravenflight.",
  permissionLevel: 50,
  ephemeral: true,
});

const quotes: string[][] = [
  [
    `yeaaaah if you're actually seriously developing apps you aren't fucking off on discord all day`,
    `🙃`,
    `idk why this thing about people roleplaying software engineers on the internet has become so big lately like`,
  ],
  [
    `real camera: get lens flare\npeople: apple put a real camera in phone\npeople when apple puts a real camera in iphone: no not like this 😮`,
  ],
  [
    `can you not just upload random videos that you probably don't have permission to share, thanks`,
    `regardless if it's a "leak" or not, straight up, if you post content here you don't have a license to, you will be banned immediately`,
    `this is how Discord works`,
  ],
  [`also M1 is the fastest CPU that exists`],
];

Bonjour.useCommand(
  "ravenflight",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const { channel } = interaction;
    if (!channel || !(channel instanceof TextChannel)) {
      throw new Error("Must be run in a channel");
    }
    const ravenflight = await Bonjour.useCurrentClient().client.users.fetch(
      "263552026791641098"
    );
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const webhook = await channel.createWebhook(ravenflight.username, {
      avatar: ravenflight.displayAvatarURL(),
    });
    let totalDelay = 0;
    for (let i = 0; i < quote.length; i++) {
      const delay = (Math.floor(Math.random() * 3) + 1) * 1000;
      totalDelay += delay;
      setTimeout(async () => {
        await webhook.send(quote[i]);
      }, totalDelay);
    }
    setTimeout(async () => {
      await webhook.delete();
    }, totalDelay + 3000);
    return `Successfully queued ravenflight harassment.`;
  }
);
