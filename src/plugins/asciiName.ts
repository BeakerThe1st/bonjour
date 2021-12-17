import ASCIIFolder from "fold-to-ascii";
import { GuildMember, PartialGuildMember } from "discord.js";
import { useEvent } from "../core";

const foldNickname = async (member: GuildMember) => {
  console.log("folding nick");
  if (!member.nickname) {
    return;
  }
  console.log("user has nick");
  const newNick = ASCIIFolder.foldReplacing(member.nickname);
  console.log(`before ${member.nickname} after ${newNick}`);
  if (newNick !== member.nickname) {
    console.log("they do not equal");
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
            color: "RED",
          },
        ],
      });
    } catch {
      //ignored
    }
  }
};

useEvent("guildMemberAdd", foldNickname);
useEvent(
  "guildMemberUpdate",
  (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
    foldNickname(newMember);
  }
);
