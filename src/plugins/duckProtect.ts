import { GuildMember, Invite, PartialGuildMember } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent(
  "guildMemberRemove",
  async (member: GuildMember | PartialGuildMember) => {
    const { guild, id: memberId } = member;
    if (memberId !== "486512530882297856") {
      return;
    }
    const log = (
      await guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_KICK",
      })
    ).entries.first();
    if (!log) {
      return;
    }
    const { target } = log;
    if (!target || target instanceof Invite || target.id !== memberId) {
      return;
    }
    (await guild.members.fetch("335006942797889549")).kick("DuckProtect™️");
  }
);
