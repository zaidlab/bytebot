const fs = require('fs');
const path = require('path');
const { parseTime } = require('../utilities/timeParser');

const mutedUsersFilePath = path.join(__dirname, '../../database/mutedUsers.json');

function readMutedUsers() {
  try {
    const data = fs.readFileSync(mutedUsersFilePath, 'utf8');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading muted users:', error);
    return {};
  }
}

function saveMutedUsers(mutedUsers) {
  try {
    fs.writeFileSync(mutedUsersFilePath, JSON.stringify(mutedUsers, null, 2));
  } catch (error) {
    console.error('Error saving muted users:', error);
  }
}

module.exports = {
  name: 'mute',
  description: 'Mute a user',
  async execute(message, args) {
    if (!message.guild) return message.reply('This command can only be used in a server.');
    if (!message.member.permissions.has('MANAGE_ROLES')) return message.reply('You do not have permission to mute members.');

    const user = message.mentions.members.first();
    if (!user) return message.reply('Please mention a valid user to mute.');

    const durationString = args[args.length - 1];
    const duration = parseTime(durationString);
    if (!duration) return message.reply('Please provide a valid mute duration (e.g., 1h, 30m).');
    
    // Ensure the mute duration is at least 10 minutes
    const minDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (duration < minDuration) return message.reply('The minimum mute duration is 10 minutes.');

    const reason = args.slice(1, -1).join(' ') || 'misconduct';

    const mutedUsers = readMutedUsers();
    if (mutedUsers[user.id]) return message.reply('This user is already muted.');

    const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
    if (!muteRole) return message.reply('Mute role not found. Please set up a role named "Muted".');

    await user.roles.add(muteRole);
    mutedUsers[user.id] = { timestamp: Date.now(), duration, reason };
    saveMutedUsers(mutedUsers);
    message.channel.send(`${user.user.tag} has been muted for ${durationString} due to ${reason}.`);

    setTimeout(async () => {
      await user.roles.remove(muteRole);
      delete mutedUsers[user.id];
      saveMutedUsers(mutedUsers);
      console.log(`User ${user.user.tag} has been unmuted.`);
    }, duration);
  },
};
