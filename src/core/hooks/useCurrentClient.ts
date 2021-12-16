import { BonjourClient } from "..";

let client: BonjourClient;

const useCurrentClient = () => {
  const setClient = (newClient: BonjourClient) => {
    client = newClient;
    useCurrentClient().client.emit("bonjourDebug", `Changed current client`);
  };
  return { client, setClient };
};

export { useCurrentClient };
