import { CommandInteraction, GuildMember } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "eb",
  description: "Event blocklists a user.",
  options: [
    {
      name: "user",
      description: "User to event blocklist.",
      type: "USER",
      required: true,
    },
  ],
  permissionLevel: 50,
});

Bonjour.useCommand(
  "eb",
  async (interaction: CommandInteraction): Bonjour.CommandResponsePromise => {
    const member = interaction.options.getMember("user", true);
    if (!(member instanceof GuildMember)) {
      throw new Error("Member is not an instanceof GuildMember");
    }
    if (!interaction.guild) {
      throw new Error("That command must only be run in a guild.");
    }
    const eventBlocklistRole = await interaction.guild.roles.fetch(
      "950717415816319026"
    );
    if (!eventBlocklistRole) {
      throw new Error("Cannot find event blocklist role");
    }
    await member.roles.add(eventBlocklistRole);
    return `Successfully blocklisted ${member}.`;
  }
);
