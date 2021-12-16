import { CommandInteraction } from "discord.js";
import { CommandResponse, CommandResponsePromise } from "../types";

type CommandExecutor = (
  interaction: CommandInteraction
) => CommandResponse | CommandResponsePromise;

const commandExecutors = new Map<string, CommandExecutor>();

const useCommand = (name: string, executor: CommandExecutor) => {
  commandExecutors.set(name, executor);
};

export { useCommand, commandExecutors };
