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
    } catch {
      //ignored
    }
  }
};

useEvent("guildMemberAdd", foldNickname);
useEvent("guildMemberUpdate", foldNickname);
