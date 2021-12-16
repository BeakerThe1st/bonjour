import { Guild, GuildApplicationCommandPermissionData } from "discord.js";
import { useCommandRegistry, useCurrentClient } from ".";

const usePermissions = (guild: Guild) => {
  const update = async (permissionLevels: Map<string, number>) => {
    const { client } = useCurrentClient();
    client.emit("bonjourDebug", `Updating permissions in ${guild.name}`);
    const fullPermissions: GuildApplicationCommandPermissionData[] = [];
    const discordCommandList = await client.application?.commands.fetch();
    if (!discordCommandList) {
      throw new Error("Commands undefined when trying to update permissions.");
    }
    const bonjourCommandList = useCommandRegistry().getCommands();
    for (const [commandId, discordCommand] of discordCommandList) {
      const bonjourCommand = bonjourCommandList.get(discordCommand.name);
      if (!bonjourCommand) {
        continue;
      }
      const allowedGroups: string[] = [];
      permissionLevels.forEach((permissionLevel, roleId) => {
        if (permissionLevel >= bonjourCommand.permissionLevel) {
          allowedGroups.push(roleId);
        }
      });
      fullPermissions.push({
        id: commandId,
        permissions: allowedGroups.map((roleId) => {
          return {
            id: roleId,
            type: "ROLE",
            permission: true,
          };
        }),
      });
    }
    guild.commands.permissions.set({ fullPermissions }).then(() => {
      client.emit("bonjourDebug", `Updated permissions in ${guild.name}`);
    });
  };
  return { update };
};

export { usePermissions };
