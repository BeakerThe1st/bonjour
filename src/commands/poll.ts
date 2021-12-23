import * as Bonjour from "../core";

Bonjour.useCommandRegistry().register({
  name: "poll",
  description: "Creates a poll.",
  options: [
    {
      type: 'STRING',
      name: 'question',
      description: 'The question you want to poll.',
    },
  ],
  permissionLevel: 0,
});
