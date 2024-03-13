const wait = require("node:timers/promises").setTimeout;

module.exports = {
  name: "coinflip",
  description: "👛 Flip a coin",
  execute(message) {
    const options = ["Heads", "Tails"];
    const result = options[Math.floor(Math.random() * options.length)];

    message.channel.send("Flipping...").then((reply) => {
      wait(1000).then(() => {
        reply.edit(`${result}!`);
      });
    });
  },
};
