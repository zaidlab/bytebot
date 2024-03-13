// commands/ban/ban.js
const { Permissions } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban a user',
  async execute(message, args, client) {
    try {
      // Check if the user has the necessary permissions to ban users
      if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        throw new Error('You do not have the required permission to ban members.');
      }

      // Check if the bot has the necessary permissions to ban users
      if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        throw new Error('I do not have permission to ban members.');
      }

      // Check if the command has the required number of arguments
      if (args.length < 1) {
        throw new Error('Please provide a user mention or their ID to ban.');
      }

      // Get the user ID and reason from the command arguments
      const userId = args.shift().replace(/[<@!>]/g, ''); // Remove mention symbols if present
      const user = await message.guild.members.fetch(userId);

      if (!user) {
        throw new Error('Invalid user ID provided.');
      }

      // Check if the command author has a specific role
      const requiredRoleName = 'Administrator'; // Replace with the name of the required role
      const requiredRole = message.guild.roles.cache.find(role => role.name === requiredRoleName);

      if (!requiredRole || !message.member.roles.cache.has(requiredRole.id)) {
        throw new Error('You do not have the required role to use this command.');
      }

      // Check if the target user has the same role as the command author
      if (user.roles.cache.has(requiredRole.id)) {
        throw new Error('You cannot ban a user with the same role.');
      }

      const reason = args.join(' ') || 'misconduct';

      // Log verbose information to the console
      console.log(`Command executed by: ${message.author.tag}`);
      console.log(`Target user: ${user.user.tag} (${user.id})`);
      console.log(`Reason: ${reason || 'No reason provided'}`);

      // Ban the user
      await user.ban({ reason });

      // Send a confirmation message
      message.channel.send(`${user.user.tag} has been banned for ${reason}.`);
      console.log(`User ${user.user.tag} has been banned for ${reason}.`);
    } catch (error) {
      console.error('Error in ban command:', error.message);
      message.reply(`An error occurred: ${error.message}`);
    }
  },
};
