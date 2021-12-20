import {
  CommandInteraction,
  GuildMember,
  Interaction,
  Message,
  MessageEmbed,
} from "discord.js";
import * as Bonjour from "../core";

const santaSquadRole = "922282045223342120";

Bonjour.useCommandRegistry().register({
  name: "santa",
  description:
    "Request SantaSquad role if you have a santa hat in your profile picture.",
  permissionLevel: 0,
  ephemeral: true,
});

Bonjour.useCommand(
  "santa",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const santaChannel = await Bonjour.useCurrentClient().client.channels.fetch(
      "922279194015174656"
    );
    if (!santaChannel?.isText()) {
      throw new Error("Misconfiguration, please DM ModMail");
    }
    const { member } = interaction;
    if (!(member instanceof GuildMember)) {
      throw new Error("Got PartialGuildMember!");
    }
    if (member.roles.cache.has(santaSquadRole)) {
      return `You already have the SantaSquad role!`;
    }
    await santaChannel.send({
      embeds: [
        {
          title: "SantaSquad Request",
          description: `${member} has requested SantaSquad.`,
          image: {
            url: `${member.displayAvatarURL()}`,
          },
          color: "BLUE",
        },
      ],
      components: [
        {
          type: "ACTION_ROW",
          components: [
            {
              type: "BUTTON",
              customId: `santa-accept-${interaction.user.id}`,
              style: "SUCCESS",
              label: "Accept",
            },
            {
              type: "BUTTON",
              customId: `santa-deny-${interaction.user.id}`,
              label: "Deny",
              style: "DANGER",
            },
          ],
        },
      ],
    });
    return `Merry Christmas! You have successfully requested the SantaSquad role!\nIf you don't have a santa hat in your profile picture, you will be denied.`;
  }
);

Bonjour.useEvent("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isButton()) {
    return;
  }
  const { customId, message, guild } = interaction;
  if (!customId.startsWith("santa")) {
    return;
  }
  const accepted = customId.startsWith("santa-accept");
  if (!guild) {
    return;
  }
  await interaction.deferReply({ ephemeral: true });
  try {
    const member = await guild.members.fetch(customId.split("-")[2]);
    if (message instanceof Message) {
      const image = message.embeds[0]?.image?.url ?? member.displayAvatarURL();
      const embed = new MessageEmbed().setImage(image);
      if (accepted) {
        const role = await guild.roles.fetch(santaSquadRole);
        if (!role) {
          return;
        }
        await message.edit({
          embeds: [
            embed
              .setColor("GREEN")
              .setTitle("Member Accepted")
              .setDescription(
                `${interaction.user} accepted ${member} for SantaSquad.`
              ),
          ],
          components: [],
        });
        await member.roles.add(role);
        await interaction.editReply(
          `Successfully accepted ${member} for SantaSquad.`
        );
        try {
          await member.send("You were accepted into SantaSquad! 🎅");
        } catch {
          //ignored
        }
      } else {
        await message.edit({
          embeds: [
            embed
              .setColor("RED")
              .setTitle("Member Denied")
              .setDescription(
                `${interaction.user} denied ${member} for SantaSquad.`
              ),
          ],
          components: [],
        });
        await interaction.editReply(
          `Successfully denied ${member} for SantaSquad`
        );
        try {
          await member.send(
            `That's not a very festive profile picture! Please ensure you change your profile picture contains a santa hat and reapply with \`/santa\`.\nPlease also note that we judge your profile picture based on when you sent the command, if you have changed it since then, simply reapply.`
          );
        } catch {
          //ignored
        }
      }
    }
  } catch (error) {
    try {
      await interaction.editReply(`${error}`);
    } catch {
      //ignored
    }
  }
});
