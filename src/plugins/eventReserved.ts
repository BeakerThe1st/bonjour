import { Message } from "discord.js";
import * as Bonjour from "../core";

Bonjour.useEvent("messageCreate", async (message: Message) => {
  const eventTimestamp = 1646762400000;

  if (Date.now() > eventTimestamp - 43200000) {
    //12 hours before event
    return;
  }
  const { member } = message;
  if (!member) {
    return;
  }
  const eventReservedRoleId = "898095817385185330";
  if (member.roles.cache.has(eventReservedRoleId)) {
    return;
  }
  await member.roles.add(eventReservedRoleId);
});
