// Require the necessary discord.js classes
require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const interactionCreate = require("./events/client/interactionCreate");

client.on("messageReactionAdd", (reaction, user) => {
  if (user.bot) return;
  if (reaction.partial) {
    try {
      reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message: ", error);
      return;
    }
  }
  interactionCreate.execute(reaction, client);
});

client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of functionFiles) {
    require(`./functions/${folder}/${file}`)(client);
  }
}

client.handleEvents();
client.handleCommands();
// Log in to Discord with your client's token
// put token in .env file
client.login(process.env.token);
