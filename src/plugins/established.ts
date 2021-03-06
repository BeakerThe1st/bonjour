import * as Bonjour from "../core";
import { Typing } from "discord.js";

Bonjour.useEvent("typingStart", async (typing: Typing) => {
  if (!typing.inGuild()) {
    return;
  }
  const { guild, member } = typing;
  if (!member?.joinedTimestamp) {
    return;
  }
  const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
  if (member.joinedTimestamp > threeDaysAgo) {
    return;
  }

  const roleId = "881503056091557978";

  if (member.roles.cache.has(roleId)) {
    return;
  }

  const role = await guild.roles.fetch(roleId);
  if (!role) {
    return;
  }
  try {
    await member.roles.add(role);
  } catch {
    //ignored
  }
});
