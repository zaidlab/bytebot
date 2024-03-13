const { Client, GatewayIntentBits } = require('discord.js');
const { token, prefix } = require('./config');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');

// Constants for event names
const Events = {
  READY: 'ready',
  MESSAGE_CREATE: 'messageCreate',
  ERROR: 'error',
};

// Create a new Discord client
const client = new Client({
  // Specify the required Gateway Intent Bits for the bot
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Map to store commands dynamically
client.commands = new Map();

// Function to read files in a directory and load commands/events
const readFiles = (dir) => {
  // Get a list of files in the directory
  const files = readdirSync(dir);

  // Iterate through each file
  for (const file of files) {
    // Create the full file path
    const filePath = join(dir, file);

    // Check if the file is a directory
    if (statSync(filePath).isDirectory()) {
      // If it's a directory, recursively read commands/events in subdirectories
      readFiles(filePath);
    } else if (file.endsWith('.js')) {
      try {
        // Attempt to require the script
        const script = require(filePath);

        // Check if the script is a command or event and handle accordingly
        if (script.name && script.execute) {
          // If it has 'name' and 'execute', it's a command, add it to the commands map
          client.commands.set(script.name, script);
        } else if (script.name && script.event && script.execute) {
          // If it has 'name', 'event', and 'execute', it's an event, register the event
          client.on(script.event, (...args) => {
            try {
              // Execute the event with proper error handling
              script.execute(...args, client);
            } catch (error) {
              console.error(`Error executing event '${script.event}':`, error);
            }
          });
        }
      } catch (error) {
        // Log an error if there's an issue loading the script
        console.error(`Error loading script '${file}':`, error);
      }
    }
  }
};

// Load commands/events from the 'commands' directory and 'events' directory
readFiles(join(__dirname, 'commands'));
readFiles(join(__dirname, 'events'));

// Event: Bot is ready
client.on(Events.READY, () => {
  // Log bot information when it's ready
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Connected to ${client.guilds.cache.size} guilds:`);

  // Log guild information
  client.guilds.cache.forEach((guild) => {
    console.log(`- ${guild.name} (ID: ${guild.id}) with ${guild.memberCount} members`);
  });
});

// Event: Message is created
client.on(Events.MESSAGE_CREATE, async (message) => {
  try {
    // Check if the message is not from a bot
    if (!message.author.bot) {
      // Check if the message is cross-posted
      if (message.crosspostable) {
        // Handle the cross-posted message
        message.reply('Cross-posting messages is not allowed in this server. Your message has been removed.')
          .then(() => message.delete())
          .catch(error => {
            console.error(`Error handling cross-posted message: ${error.message}`);
          });
      } else if (message.content.startsWith(prefix)) {
        // Extract command name and arguments
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Get the corresponding command from the commands map
        const command = client.commands.get(commandName);

        if (command) {
          try {
            // Implementing command timeout
            const executionPromise = command.execute(message, args, client);
            const timeout = 5000; // 5 seconds

            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Command execution timed out')), timeout)
            );

            // Wait for either command execution or timeout
            let completedPromise;
            try {
              completedPromise = await Promise.race([executionPromise, timeoutPromise]);
            } catch (error) {
              // Handle the timeout error
              console.error(`Command execution timed out: ${error.message}`);
              message.reply('Command execution timed out.');
            }

            // Check if the command execution promise has resolved
            if (completedPromise === executionPromise) {
              // Command executed successfully
              // Log guild members if the message is in a guild
              if (message.guild) {
                const guildMembers = message.guild.members.cache;
              }
            }
          } catch (error) {
            // Log an error if there's an issue executing the command
            console.error(`Error executing command '${command.name}':`, error);
            message.reply('There was an error executing the command.');
          }
        } else {
          // Reply if the command is not found
          message.reply(`Command '${commandName}' not found. Type ${prefix}help for a list of available commands.`);
        }
      }
    }
  } catch (error) {
    // Log an error if there's an issue handling the message
    console.error(`Error handling message: ${error}`);
  }
});

// Event: Error
client.on(Events.ERROR, (error) => {
  // Log Discord client errors
  console.error('Discord client error:', error);
});

// Log in to Discord with the bot's token
client.login(token);
