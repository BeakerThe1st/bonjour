import {
  ApplicationCommandData,
  InteractionReplyOptions,
  MessageEmbed,
  MessagePayload,
} from "discord.js";

enum DebugType {
  NONE,
  BONJOUR,
  DISCORDJS,
  ALL,
}

type Command = ApplicationCommandData & {
  ephemeral?: boolean;
  permissionLevel: number;
};

type CommandRegistry = {
  register(command: Command): void;
  getCommands: () => Map<string, Command>;
};

type CommandResponse =
  | string
  | MessageEmbed
  | MessagePayload
  | InteractionReplyOptions
  | null;
type CommandResponsePromise = Promise<CommandResponse>;

export type {
  Command,
  CommandRegistry,
  CommandResponse,
  CommandResponsePromise,
};
export { DebugType };
