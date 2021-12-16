import * as Bonjour from "../bonjour";

const registry = Bonjour.useCommandRegistry();
registry.register({
  name: "config",
  description: "Configurates Bonjour.",
  permissionLevel: 50,
});
