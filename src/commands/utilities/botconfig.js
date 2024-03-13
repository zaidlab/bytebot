// botconfig.js
const { Client } = require('discord.js');

module.exports = {
  name: 'botconfig',
  description: 'Change bot settings (owner only)',
  ownerOnly: true, // This flag ensures that only the bot owner can use the command

  async execute(message, args, client) {
    // Get the Discord user ID of the bot owner
    const ownerId = '1063400569689100368';

    // Check if the user executing the command is the bot owner
    if (message.author.id !== ownerId) {
      message.reply('You are not the bot owner. This command is restricted to the owner.');
      return;
    }

    const subcommand = args[0]?.toLowerCase();

    switch (subcommand) {
      case 'changename':
        // Usage: !botconfig changename <new name>
        const newName = args.slice(1).join(' ');
        try {
          await client.user.setUsername(newName);
          message.reply(`Bot name changed to: ${newName}`);
        } catch (error) {
          console.error('Error changing bot name:', error);
          message.reply('Failed to change bot name.');
        }
        break;

      case 'changeavatar':
        // Usage: !botconfig changeavatar <image URL>
        const newAvatarURL = args[1];
        try {
          await client.user.setAvatar(newAvatarURL);
          message.reply('Bot avatar changed.');
        } catch (error) {
          console.error('Error changing bot avatar:', error);
          message.reply('Failed to change bot avatar.');
        }
        break;

      case 'setstatus':
        // Usage: !botconfig setstatus <status>
        const newStatus = args.slice(1).join(' ');
        try {
          await client.user.setActivity(newStatus);
          message.reply(`Bot playing status set to: ${newStatus}`);
        } catch (error) {
          console.error('Error setting bot playing status:', error);
          message.reply('Failed to set bot playing status.');
        }
        break;

      default:
        message.reply('Invalid subcommand. Available subcommands: changename, changeavatar, setstatus');
        break;
    }
  },
};
