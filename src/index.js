const { Client, GatewayIntentBits } = require('discord.js');
const { token, prefix } = require('./config');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');

// Initialize Discord client with specified intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Dynamically store commands for easy retrieval
client.commands = new Map();

/**
 * Recursively reads files from a directory to load commands and events.
 */
const loadFiles = (dir) => {
  const files = readdirSync(dir);
  files.forEach(file => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      loadFiles(filePath);
    } else if (file.endsWith('.js')) {
      const script = require(filePath);
      if (script.name) {
        if (script.execute) {
          client.commands.set(script.name, script);
        } else if (script.event && typeof script.event === 'string') {
          client.on(script.event, script.run.bind(null, client));
        }
      }
    }
  });
};

// Load commands and events
loadFiles(join(__dirname, 'commands'));
loadFiles(join(__dirname, 'events'));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.guilds.cache.forEach(guild => {
    console.log(`- ${guild.name} (ID: ${guild.id}) with ${guild.memberCount} members`);
  });
});

// Modified messageCreate event listener to include claptrap's logic
client.on('messageCreate', async (message) => {
  // Integrate claptrap functionality
  if (!message.author.bot) {
    const mentioned = message.mentions.has(client.user);
    const containsKeywords = ['hey', 'hello', 'hi'].some(keyword => message.content.toLowerCase().includes(keyword));
    if (mentioned || containsKeywords) {
      const responses = [
        'Hey there, minion!',
        'Greetings, Vault Hunter!',
        'Hello, traveler!',
        'Hi, I\'m CL4P-TP, your friendly neighborhood robot!',
        'What can I do for you today?',
        'Howdy, partner!',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      message.reply(randomResponse);
      return; // Prevent processing the same message further if claptrap responds
    }
  }

  // Proceed with command handling if the message isn't for claptrap
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || Array.from(client.commands.values()).find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (command) {
    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(`Error executing command '${command.name}':`, error);
      message.reply('There was an error trying to execute that command.');
    }
  } else {
    message.reply(`Command '${commandName}' not found. Use ${prefix}help for a list of available commands.`);
  }
});

client.on('error', (error) => console.error('Discord client error:', error));

client.login(token);
