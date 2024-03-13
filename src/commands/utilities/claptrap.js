// claptrap.js
module.exports = {
  event: 'messageCreate',
  execute(message, client) {
    // Check if the message author is the bot itself
    if (message.author.bot) {
      return; // Ignore messages from the bot
    }

    // Check if the bot was mentioned or if the message contains specific keywords
    const mentioned = message.mentions.has(client.user);
    const containsKeywords = ['hey', 'hello', 'hi'].some(keyword => message.content.toLowerCase().includes(keyword));

    // Check if either condition is true
    if (mentioned || containsKeywords) {
      // Array of responses
      const responses = [
        'Hey there, minion!',
        'Greetings, Vault Hunter!',
        'Hello, traveler!',
        'Hi, I\'m CL4P-TP, your friendly neighborhood robot!',
        'What can I do for you today?',
        'Howdy, partner!',
      ];

      // Get a random response
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      // Reply with the random response
      message.reply(randomResponse);
    }
  },
};
