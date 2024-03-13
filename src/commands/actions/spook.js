module.exports = {
    name: 'spook',
    description: 'Sp00ktober by camiel.',
    execute: async (message, args) => {
      const user = message.mentions.users.first();
      if (user) {
        message.channel.send(`${message.author.username} sp00ks ${user.username} in the spirit of Spooktober.`);
      } else {
        message.reply('Please mention a user to sp00k.');
      }
    }
  };
  