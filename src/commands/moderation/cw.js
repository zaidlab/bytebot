// bytebot/commands/moderation/remove-warnings.js
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

const removeWarningsCommand = (message, args) => {
  const guildId = message.guild.id;
  const warnings = loadWarnings();

  if (warnings[guildId]) {
    const punishmentIdToRemove = parseInt(args[0]);

    if (isNaN(punishmentIdToRemove) || punishmentIdToRemove <= 0) {
      message.reply('Please provide a valid punishment ID to remove.');
      return;
    }

    let removed = false;

    Object.keys(warnings[guildId]).forEach(userId => {
      const userWarnings = warnings[guildId][userId];
      const removedWarningIndex = userWarnings.findIndex(warning => warning.id === punishmentIdToRemove);

      if (removedWarningIndex !== -1) {
        userWarnings.splice(removedWarningIndex, 1);
        removed = true;
      }
    });

    if (removed) {
      saveWarnings(warnings);
      message.reply(`Punishment ID ${punishmentIdToRemove} removed.`);
    } else {
      message.reply(`Punishment ID ${punishmentIdToRemove} not found.`);
    }
  } else {
    message.reply('No punishments found in the database.');
  }
};

module.exports = {
  name: 'cw',
  aliases: ['rw', 'clear-warnings', 'cw'], // Add aliases here
  description: 'Remove specific warnings by their IDs.',
  execute(message, args) {
    removeWarningsCommand(message, args);
  },
};
