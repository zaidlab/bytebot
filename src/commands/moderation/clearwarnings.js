const fs = require('fs');
const path = require('path');

const databasePath = path.join(__dirname, '..', '..', 'database', 'warningsdb.json');

// Reuse the loadWarnings and saveWarnings functions from earlier examples
const loadWarnings = () => {
  try {
    const data = fs.readFileSync(databasePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading warnings:', error);
    return {};
  }
};

const saveWarnings = (warnings) => {
  try {
    const data = JSON.stringify(warnings, null, 2);
    fs.writeFileSync(databasePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving warnings:', error);
  }
};

// Command to clear all warnings for a specified user
const clearWarningsCommand = (message) => {
  // Ensure the command issuer has the permission to clear warnings
  if (!message.member.permissions.has('MANAGE_MESSAGES')) {
    return message.reply('You do not have permission to clear warnings.');
  }

  const targetUser = message.mentions.members.first();
  if (!targetUser) {
    return message.reply('Please mention a user to clear their warnings.');
  }

  const warnings = loadWarnings();
  const guildId = message.guild.id;

  // Check if the user has warnings in the specified guild
  if (warnings[guildId] && warnings[guildId][targetUser.id]) {
    // Clear the warnings for the user
    delete warnings[guildId][targetUser.id];
    saveWarnings(warnings);

    message.reply(`All warnings for ${targetUser.user.tag} have been cleared.`);
  } else {
    message.reply('User has no warnings to clear.');
  }
};

module.exports = {
  name: 'cws',
  description: 'Clear all warnings for a specified user.',
  execute(message, args) {
    clearWarningsCommand(message);
  },
};
