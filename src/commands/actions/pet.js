module.exports = {
    name: 'pet',
    description: 'Pet kitties.',
    execute: async (message, args) => {
      const user = message.mentions.users.first();
      if (user) {
        message.channel.send(`${message.author.username} pets kitties with ${user.username}.`);
      } else {
        message.reply('Please mention a user to pet kitties with.');
      }
    }
  };
  