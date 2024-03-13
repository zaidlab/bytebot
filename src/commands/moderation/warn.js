// bytebot/commands/moderation/warn.js
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

const saveWarnings = (warnings) => {
  try {
    const data = JSON.stringify(warnings, null, 2);
    fs.writeFileSync(databasePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving warnings:', error);
  }
};

const warnCommand = (message, args) => {
  const targetUser = message.mentions.members.first();
  const reason = args.slice(1).join(' '); // Exclude the first argument (mention)

  if (targetUser) {
    const guildId = message.guild.id;
    const warnings = loadWarnings();

    warnings[guildId] = warnings[guildId] || {};
    warnings[guildId][targetUser.id] = warnings[guildId][targetUser.id] || [];

    const warningId = Math.floor(Math.random() * 1000000) + 1;

    warnings[guildId][targetUser.id].push({
      id: warningId,
      reason,
      timestamp: new Date().toISOString(),
    });

    saveWarnings(warnings);

    message.reply(`User ${targetUser.user.tag} has been warned. Warning ID: ${warningId}`);
  } else {
    message.reply('Please mention a user to warn.');
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
  name: 'warn',
  description: 'Warn a user and view their warning history.',
  execute(message, args) {
    if (message.content.startsWith('!warn')) {
      warnCommand(message, args);
    } else if (message.content.startsWith('!warnings')) {
      warningsCommand(message);
    }
  },
};
