module.exports = {
    name: 'eat',
    description: 'Eat like a boss.',
    execute: async (message, args) => {
      const user = message.mentions.users.first();
      if (user) {
        message.channel.send(`${message.author.username} eats like a boss with ${user.username}.`);
      } else {
        message.reply('Please mention a user to eat with.');
      }
    }
  };
  