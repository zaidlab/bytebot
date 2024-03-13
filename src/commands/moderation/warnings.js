const fs = require('fs');
const path = require('path');

const databasePath = path.join(__dirname, '..', '..', 'database', 'warningsdb.json');

// Function to load warnings from the database
const loadWarnings = () => {
  try {
    const data = fs.readFileSync(databasePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading warnings:', error);
    return {};
  }
};

// Function to display a user's warning history, including points and decay
const warningsCommand = (message) => {
  const targetUser = message.mentions.members.first();

  if (targetUser) {
    const guildId = message.guild.id;
    const warnings = loadWarnings();

    // Check if the user has warnings in the specified guild
    if (warnings[guildId] && warnings[guildId][targetUser.id]) {
      const userWarnings = warnings[guildId][targetUser.id];
      const totalPoints = userWarnings.reduce((acc, warning) => acc + warning.points, 0);

      // Map each warning to a string including its ID, reason, timestamp, and points
      const warningList = userWarnings.map(warning => `ID: ${warning.id}, Reason: ${warning.reason}, Timestamp: ${warning.timestamp}, Points: ${warning.points}`);

      // Reply with the user's warning history and the total points
      message.reply(`Warning history for ${targetUser.user.tag}:\n${warningList.join('\n')}\nTotal Points: ${totalPoints}`);
    } else {
      message.reply('User has no warnings.');
    }
  } else {
    message.reply('Please mention a user to view their warning history.');
  }
};

module.exports = {
  name: 'warnings',
  description: 'View warning history for a user.',
  execute(message) {
    warningsCommand(message);
  },
};
