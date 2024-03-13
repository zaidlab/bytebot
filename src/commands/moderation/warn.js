const fs = require('fs');
const path = require('path');
const { schedule } = require('node-cron');

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

const decayWarningPoints = () => {
  const warnings = loadWarnings();
  const decayPoints = 1; // Points to decay
  const decayPeriodMs = 86400000 * 7; // 7 days in milliseconds

  for (const guildId in warnings) {
    for (const userId in warnings[guildId]) {
      warnings[guildId][userId] = warnings[guildId][userId].map(warning => {
        const timePassed = new Date() - new Date(warning.timestamp);
        if (timePassed > decayPeriodMs) {
          warning.points = Math.max(warning.points - decayPoints, 0); // Ensure points don't go below 0
        }
        return warning;
      }).filter(warning => warning.points > 0); // Remove warnings with 0 points
    }
  }

  saveWarnings(warnings);
};

// Schedule the decay of warning points to run daily
schedule('0 0 * * *', decayWarningPoints);

const warnCommand = (message, args) => {
  const targetUser = message.mentions.members.first();
  const reason = args.slice(1).join(' '); // Exclude the first argument (mention)
  const warningPoints = 1; // Points assigned to a new warning

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
      points: warningPoints, // Add points to the warning
    });

    saveWarnings(warnings);

    message.reply(`User ${targetUser.user.tag} has been warned. Warning ID: ${warningId}, Points: ${warningPoints}`);
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
      const totalPoints = userWarnings.reduce((acc, warning) => acc + warning.points, 0);
      const warningList = userWarnings.map(warning => `ID: ${warning.id}, Reason: ${warning.reason}, Timestamp: ${warning.timestamp}, Points: ${warning.points}`);
      message.reply(`Warning history for ${targetUser.user.tag}:\n${warningList.join('\n')}\nTotal Points: ${totalPoints}`);
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
