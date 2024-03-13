const cron = require('node-cron');
const { Client, GatewayIntentBits } = require('discord.js');
const { token, hyperActiveRoleID } = require('../config');
const fs = require('fs/promises');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

// Path to the JSON file
const dbFilePath = './bytebot/database/activitydb.json';

// Map to store user message counts
const messageCounts = new Map();

// Define the duration (in days) over which to calculate the average
const averageDurationDays = 7;

// Schedule the task to run daily at a specific time (e.g., midnight)
cron.schedule('0 0 * * *', () => {
  checkMessageActivityAndAssignRole();
});

client.on('messageCreate', (message) => {
  updateMessageCount(message);
});

async function updateMessageCount(message) {
  // Ignore messages from bots
  if (message.author.bot) {
    return;
  }

  const userId = message.author.id;

  // Increment the user's message count
  messageCounts.set(userId, (messageCounts.get(userId) || 0) + 1);
}

async function checkMessageActivityAndAssignRole() {
  // Replace 'YOUR_GUILD_ID' with your actual guild ID
  const guildId = '1104856112626413659';

  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    console.error(`Guild with ID ${guildId} not found.`);
    return;
  }

  // Get the "hyper active" role
  const role = guild.roles.cache.get(hyperActiveRoleID);
  if (!role) {
    console.error(`Role with ID ${hyperActiveRoleID} not found in the guild.`);
    return;
  }

  try {
    // Load message counts from the database
    const data = await fs.readFile(dbFilePath, 'utf8');

    // Parse the JSON data
    const savedMessageCounts = JSON.parse(data);

    // Validate that parsed data is an object
    if (typeof savedMessageCounts !== 'object' || savedMessageCounts === null) {
      console.error('Invalid data format in the database.');
      return;
    }

    // Update message counts based on the loaded data
    for (const [userId, count] of Object.entries(savedMessageCounts)) {
      messageCounts.set(userId, count);
    }
  } catch (readError) {
    // Handle errors while reading the file
    console.error(`Error reading message counts from the database: ${readError.message}`);
  }

  // Iterate through each user's message count
  messageCounts.forEach((messageCount, userId) => {
    const member = guild.members.cache.get(userId);

    if (member && !member.user.bot) {
      // Calculate the average message count per day
      const averageMessagesPerDay = messageCount / averageDurationDays;

      // Adjust the threshold dynamically based on the average
      const dynamicThreshold = Math.ceil(averageMessagesPerDay);

      // Check if the user has the "hyper active" role and has not met the threshold
      if (messageCount < dynamicThreshold && member.roles.cache.has(hyperActiveRoleID)) {
        member.roles.remove(role)
          .then(() => console.log(`Role ${role.name} removed from ${member.user.tag}`))
          .catch(removeError => console.error(`Error removing role: ${removeError.message}`));
      }
      // Check if the user does not have the "hyper active" role and has exceeded the threshold
      else if (messageCount >= dynamicThreshold && !member.roles.cache.has(hyperActiveRoleID)) {
        member.roles.add(role)
          .then(() => console.log(`Role ${role.name} assigned to ${member.user.tag}`))
          .catch(addError => console.error(`Error assigning role: ${addError.message}`));
      }
    }
  });

  try {
    // Save message counts to the database
    const messageCountsToSave = Array.from(messageCounts.entries()).reduce((obj, [userId, count]) => {
      obj[userId] = count;
      return obj;
    }, {});

    await fs.writeFile(dbFilePath, JSON.stringify(messageCountsToSave, null, 2), 'utf8');
    console.log('Message counts saved to the database.');
  } catch (writeError) {
    // Handle errors while writing to the file
    console.error(`Error saving message counts to the database: ${writeError.message}`);
  }

  // Clear message counts for the next day
  messageCounts.clear();
}

module.exports = {
  checkMessageActivityAndAssignRole, // Export this function if needed elsewhere
};
