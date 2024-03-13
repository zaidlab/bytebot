const fs = require('fs');
const path = require('path');

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
    name: 'pardon',
    description: 'Unmute a user',
    async execute(message, args) {
        if (!message.guild) return message.reply('This command can only be used in a server.');
        if (!message.member.permissions.has('MANAGE_ROLES')) return message.reply('You do not have permission to unmute members.');

        const userId = args.length ? args.shift().replace(/[<@!>]/g, '') : null;
        const user = userId ? message.guild.members.cache.get(userId) : null;

        if (!user) return message.reply('Please provide a valid user mention or their ID to unmute.');

        const mutedUsers = readMutedUsers();

        if (!mutedUsers[user.id]) return message.reply('This user is not currently muted.');

        const mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');
        if (!mutedRole) return message.reply('Muted role not found. Please create a role named "Muted".');

        await user.roles.remove(mutedRole);

        delete mutedUsers[user.id];
        saveMutedUsers(mutedUsers);

        message.channel.send(`${user.user.tag} has been pardoned and unmuted.`);
        console.log(`User ${user.user.tag} has been pardoned and unmuted.`);
    },
};
