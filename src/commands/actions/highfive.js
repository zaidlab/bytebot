module.exports = {
    name: 'highfive',
    description: 'High five like a boss.',
    execute: async (message, args) => {
      const user = message.mentions.users.first();
      if (user) {
        message.channel.send(`${message.author.username} high fives like a boss with ${user.username}.`);
      } else {
        message.reply('Please mention a user to high five with.');
      }
    }
  };
  