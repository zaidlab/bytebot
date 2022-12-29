// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const fs = require('fs');
const path = require('node:path');
const {prefix, token} = require('../data/config.json');
const { SlashCommandBuilder } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Create collections for commands and events
client.commands = new Collection();
client.events = new Collection();

// Read the contents of the commands and events folders
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Loop through the command files and import them
commandFiles.forEach(file => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
});

// Loop through the event files and import them
eventFiles.forEach(file => {
  const event = require(`./events/${file}`);
  client.events.set(event.name, event);

  // Bind the event to the client
  client.on(event.name, (...args) => event.execute(client, ...args));
});

// Log in to Discord with your client's token
client.login(token);
