const { Message } = require('discord.js');

module.exports = {
  name: 'poll',
  description: 'Creates a simple poll.',
  async execute(message = new Message(), args) {
    // Combine the arguments to form the poll question
    const pollQuestion = args.join(' ');
    if (!pollQuestion) return message.reply('Please provide a question for the poll.');

    try {
      // Construct the poll message
      const pollMessageContent = `__New poll by ${message.author}__\n\n${pollQuestion}`;
      
      // Send the poll message
      const pollMessage = await message.channel.send(pollMessageContent);
      
      // React with thumbs up and thumbs down to create the poll
      await pollMessage.react('👍');
      await pollMessage.react('👎');

      // Delete the original command message
      await message.delete();
    } catch (error) {
      console.error('Failed to create the poll:', error);
      message.reply('There was an error trying to create the poll.');
    }
  },
};
