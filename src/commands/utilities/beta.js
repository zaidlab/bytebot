const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'embed',
  description: 'Sends an embedded message.',
  execute(message) {
    // Create a new embed object
    const embed = new MessageEmbed()
      .setColor('#0099ff') // Set the color of the embed
      .setTitle('Sample Embed') // Set the title of the embed
      .setURL('https://example.com') // Set the URL the title will link to
      .setAuthor({ name: 'Bot Name', iconURL: 'https://example.com/bot.png', url: 'https://example.com' }) // Set the author of the embed
      .setDescription('This is a sample embed to showcase what they look like and what they can do.') // Set the main content of the embed
      .setThumbnail('https://example.com/thumbnail.png') // Set the thumbnail of the embed
      .addFields(
        { name: 'Regular Field Title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' }, // Add a blank field
        { name: 'Inline Field 1', value: 'Some value', inline: true },
        { name: 'Inline Field 2', value: 'Some value', inline: true },
      ) // Add fields to the embed
      .addField('Inline Field 3', 'Some value', true) // Add another field, inline
      .setImage('https://example.com/image.png') // Set the main image of the embed
      .setTimestamp() // Set the timestamp at the bottom
      .setFooter({ text: 'Some footer text here', iconURL: 'https://example.com/footer.png' }); // Set the footer of the embed

    // Send the embed to the same channel as the message
    message.channel.send({ embeds: [embed] });
  },
};
