import { useCurrentClient } from ".";
import { ClientEvents } from "discord.js";

const useEvent = <K extends keyof ClientEvents>(
  eventName: K,
  executor: (...args: ClientEvents[K]) => void | Promise<void>
) => {
  const { client } = useCurrentClient();
  client.on(eventName, async (...args: ClientEvents[K]) => {
    try {
      await executor(...args);
    } catch (error) {
      console.log(`Error with ${eventName} event`, error);
    }
  });
  client.emit("bonjourDebug", `Registered handler for ${eventName}`);
};

export { useEvent };
