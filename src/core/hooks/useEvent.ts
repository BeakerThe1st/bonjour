import { useCurrentClient } from ".";
import { ClientEvents } from "discord.js";

const useEvent = <K extends keyof ClientEvents>(
  eventName: K,
  executor: (...args: ClientEvents[K]) => void
) => {
  const { client } = useCurrentClient();
  client.on(eventName, executor);
  client.emit("bonjourDebug", `Registered handler for ${eventName}`);
};

export { useEvent };
