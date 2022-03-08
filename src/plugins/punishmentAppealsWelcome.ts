import { GuildMember, PartialGuildMember, Util } from "discord.js";
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
            title: "Welcome! 👋",
            description: `Hello ${newMember}, welcome to <#${punishmentAppealsChannel}>.
            **Please do not ping staff or DM ModMail.** You are in this channel because you were muted either:
            
            1. By our moderation team
            2. By a bot
            3. Because you have an iReport and were automatically muted upon joining
            
            While you're in this channel, be sure to check out our rules over in <#476691390332403723>.
            
            You may see how long is left on your mute by using the \`!timeleft\` command. If your mute is permanent, please wait patiently and a staff member will review your case. If a staff member does not contact you within 24 hours, feel free to DM <@582568116748550144>.`,
            color: Util.resolveColor("BLUE"),
          },
        ],
      });
    } catch {
      //ignored
    }
  }
);
