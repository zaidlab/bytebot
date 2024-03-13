module.exports = {
    name: 'drink',
    description: 'Drink like a boss.',
    execute: async (message, args) => {
      const user = message.mentions.users.first();
      if (user) {
        message.channel.send(`${message.author.username} drinks like a boss with ${user.username}.`);
      } else {
        message.reply('Please mention a user to drink with.');
      }
    }
  };
  