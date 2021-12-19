import { GuildMember, PartialGuildMember } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent(
  "guildMemberUpdate",
  async (
    oldMember: GuildMember | PartialGuildMember,
    newMember: GuildMember
  ) => {
    const punishmentAppealsChannel = "559144193814167574";
    const punishedRole = "468957856855621640";
    if (
      !newMember.roles.cache.has(punishedRole) ||
      oldMember.roles.cache.has(punishedRole)
    ) {
      return;
    }

    try {
      const channel = await Bonjour.useCurrentClient().client.channels.fetch(
        punishmentAppealsChannel
      );
      if (!channel?.isText()) {
        return;
      }
      await channel.send({
        content: `${newMember}`,
        embeds: [
          {
            title: "Welcome!",
            description: `Hello ${newMember}, welcome to <#${punishmentAppealsChannel}>.
            First and foremost, please do not ping staff or DM ModMail. You are in this channel because you were muted, there are 3 potential reasons you were muted:
            
            1. You were manually muted by our moderation team
            2. You were automatically muted by a bot
            3. You have an iReport and were automatically muted upon joining
            
            Please ensure that you familiarise yourself with our rules in <#476691390332403723> before returning to the server.
            You may see how long is left on your mute by using the \`!timeleft\` command. If your mute is permanent, please wait patiently and a staff member will review your case. If a staff member does not send you a message within 24 hours, feel free to DM <@582568116748550144>.`,
          },
        ],
      });
    } catch {
      //ignored
    }
  }
);
