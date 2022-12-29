const Discord = require('discord.js');
module.exports = {
  name: 'help',
  description: 'Show a list of available commands',
  execute(client, message, args) {
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Nyx Bot Commands')
      .setDescription('Here is a list of available commands:')
      .addFields(
        { name: '📜 !help', value: 'Show this message' },
        { name: '🏓 !ping', value: 'Check the bot\'s latency' },
        { name: 'ℹ️ !info', value: 'Get information about the bot' }
      )
      .setTimestamp()
      .setFooter('Nyx Bot');

    // Send the embed message
    message.channel.send(embed);
  },
};
