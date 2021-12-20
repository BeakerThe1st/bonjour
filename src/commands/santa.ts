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
    if (
      member instanceof GuildMember &&
      member.roles.cache.has(santaSquadRole)
    ) {
      return `You already have the SantaSquad role!`;
    }
    await santaChannel.send({
      embeds: [
        {
          title: "SantaSquad Request",
          description: `${interaction.user} has requested SantaSquad.`,
          image: {
            url: `${interaction.user.displayAvatarURL()}`,
          },
        },
      ],
      components: [
        {
          type: "ACTION_ROW",
          components: [
            {
              type: "BUTTON",
              customId: `santa-accept-${interaction.user.id}`,
              style: "PRIMARY",
            },
            {
              type: "BUTTON",
              customId: `santa-deny-${interaction.user.id}`,
            },
          ],
        },
      ],
    });
    return `Merry Christmas! You have successfully requested the SantaSquad role! 
    If you do not receive the role within 24 hours and you have a santa hat in your profile picture, you may reapply if no staff member has contacted you about it.`;
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
  try {
    const member = await guild.members.fetch(customId.slice(-18));
    if (message instanceof Message) {
      const embed = new MessageEmbed().setImage(member.displayAvatarURL());
      if (accepted) {
        const role = await guild.roles.fetch("922282045223342120");
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
        });
        await member.roles.add(role);
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
        });
      }
    }
  } catch {
    //ignored
  }
});
