const { Permissions } = require('discord.js');

module.exports = {
  name: 'clear',
  description: 'Clear messages in a channel',
  permissions: ['MANAGE_MESSAGES'],
  aliases: ['c'],
  args: true,
  usage: '<amount>',
  async execute(message, args) {
    // Check if the user has the necessary permissions
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return message.reply('You do not have the required permissions to use this command.');
    }

    // Get the amount from the command parameters
    const amount = parseInt(args[0]);

    // Check if the amount is a valid number
    if (isNaN(amount) || amount <= 0) {
      return message.reply('Please provide a valid number greater than 0 for the amount of messages to clear.');
    }

    // Delete the requested number of messages
    await message.channel.bulkDelete(amount);

    // Wait for a short duration
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Send a confirmation message and delete it after a short duration
    const tempMsg = await message.channel.send(`🧹 Cleared ${amount} messages in this channel.`);
    await new Promise(resolve => setTimeout(resolve, 4000));
    await tempMsg.delete();
  },
};
