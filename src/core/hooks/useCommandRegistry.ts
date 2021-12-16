import { CommandRegistry, Command } from "../types";
import { useCurrentClient } from ".";

const commands: Map<string, Command> = new Map();
let entriesLocked = false;
let discordRegistrationPending = false;

if (!discordRegistrationPending) {
  setTimeout(() => {
    entriesLocked = true;
    registerCommandsWithDiscord();
  }, 6000);
  discordRegistrationPending = true;
}

const registerCommandsWithDiscord = async () => {
  const { client } = useCurrentClient();

  const commandManager = client.application?.commands;

  if (!commandManager) {
    throw new Error("commandManager not defined");
  }
  const commandArray = Array.from(commands.values()).map((command: Command) => {
    if (command.permissionLevel > 0) {
      command.defaultPermission = false;
    }
    return command;
  });
  await commandManager.set(commandArray);
  client.emit("bonjourDebug", `Registered all commands with Discord`);
  client.emit("commandsRegistered");
};

const useCommandRegistry = (): CommandRegistry => {
  const register = (command: Command): void => {
    if (entriesLocked) {
      throw new Error(
        `Tried to register ${command.name} more than 6 seconds after first command registration`
      );
    }
    const { client } = useCurrentClient();
    commands.set(command.name, command);
    client.emit("bonjourDebug", `Registered ${command.name} command`);
  };
  const getCommands = () => {
    return commands;
  };
  return { register, getCommands };
};

export { useCommandRegistry };
