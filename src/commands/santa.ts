import {
  CommandInteraction,
  Interaction,
  Message,
  MessageEmbed,
} from "discord.js";
import * as Bonjour from "../core";

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
    return `Successfully requested the SantaSquad role! If you do not receive the role within 24 hours and you have a santa hat in your profile picture, you may reapply if no staff member has contacted you about it.`;
  }
);

Bonjour.useEvent("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isButton()) {
    return;
  }
  const { customId, message } = interaction;
  if (!customId.startsWith("santa")) {
    return;
  }
  const accepted = customId.startsWith("santa-accept");
  try {
    const member = await interaction.guild.members.fetch(customId.slice(-18));
    if (message instanceof Message) {
      const embed = new MessageEmbed().setImage(member.displayAvatarURL());
      if (accepted) {
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
