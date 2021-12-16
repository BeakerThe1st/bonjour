import ASCIIFolder from "fold-to-ascii";
import { GuildMember, PartialGuildMember } from "discord.js";
import { useEvent } from "../core";

const foldNickname = async (member: GuildMember | PartialGuildMember) => {
  if (!member.nickname) {
    return;
  }
  const newNick = ASCIIFolder.foldReplacing(member.nickname);
  if (newNick !== member.nickname) {
    try {
      await member.setNickname(newNick, "Illegal Nickname");
      await member.send({
        embeds: [
          {
            author: {
              name: member.guild.name,
              iconURL: member.guild.iconURL() ?? undefined,
            },
            title: "Nickname Changed",
            description: `Your display name was found to violate server rules. Your nickname was changed to **${newNick}**.`,
          },
        ],
      });
    } catch {
      //ignored
    }
  }
};

useEvent("guildMemberAdd", foldNickname);
useEvent("guildMemberUpdate", foldNickname);
