module.exports = {
    name: 'boop',
    description: 'Boop da snoot.',
    execute: async (message, args) => {
      const user = message.mentions.users.first();
      if (user) {
        message.channel.send(`${message.author.username} boops ${user.username}'s snoot.`);
      } else {
        message.reply('Please mention a user to boop.');
      }
    }
  };
  