// bytebot/commands/moderation/warnings.js
const fs = require('fs');
const path = require('path');

const databasePath = path.join(__dirname, '..', '..', 'database', 'warningsdb.json');

const loadWarnings = () => {
  try {
    const data = fs.readFileSync(databasePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading warnings:', error);
    return {};
  }
};

const warningsCommand = (message) => {
  const targetUser = message.mentions.members.first();

  if (targetUser) {
    const guildId = message.guild.id;
    const warnings = loadWarnings();

    if (warnings[guildId] && warnings[guildId][targetUser.id]) {
      const userWarnings = warnings[guildId][targetUser.id];
      const warningList = userWarnings.map(warning => `ID: ${warning.id}, Reason: ${warning.reason}, Timestamp: ${warning.timestamp}`);
      message.reply(`Warning history for ${targetUser.user.tag}:\n${warningList.join('\n')}`);
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
    if (message.content.startsWith('!warnings')) {
      warningsCommand(message);
    }
  },
};
