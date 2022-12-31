// Require the necessary discord.js classes
require("dotenv").config();
const { token } = process.env;
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs"); 


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
// Log in to Discord with your client's token
//put token in .env file
client.login(token);
//if two tokens exist:
//client.login(token1 || token 2);




