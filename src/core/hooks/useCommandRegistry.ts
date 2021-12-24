import { CommandRegistry, Command } from "../types";
import { useCurrentClient } from ".";

const commands: Map<string, Command> = new Map();

let bulkRegistrationPending = false;
let bulkRegistrationComplete = false;

if (!bulkRegistrationPending) {
  bulkRegistrationPending = true;
  setTimeout(() => {
    bulkRegistrationComplete = true;
    registerCommandsWithDiscord();
  }, 15000);
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
    const { client } = useCurrentClient();
    commands.set(command.name, command);
    if (!bulkRegistrationComplete) {
      client.emit("bonjourDebug", `Registered ${command.name} command`);
    } else {
      console.log(`${command.name} not submitted to Discord.`);
    }
  };
  const getCommands = () => {
    return commands;
  };
  return { register, getCommands };
};

export { useCommandRegistry };
