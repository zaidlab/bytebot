module.exports = {
    name: '8ball',
    description: '🎱 Play 8ball with the bot',
    usage: '!8ball <question>',
    execute(message, args) {
      if (!args.length) {
        return message.reply('🎱 Please ask a question after the command, like `!8ball Is today a good day?`');
      }
  
      const fetchQuestion = args.join(' ');
      const answers = [
        { text: 'Yes, definitely.', chance: 0.1 },
        { text: 'For sure.', chance: 0.1 },
        { text: 'Positive about it.', chance: 0.1 },
        { text: 'Negative about it.', chance: 0.1 },
        { text: 'You may rely on it.', chance: 0.1 },
        { text: 'As I see it, yes.', chance: 0.1 },
        { text: 'Most likely.', chance: 0.1 },
        { text: 'Outlook good.', chance: 0.1 },
        { text: 'Yes.', chance: 0.1 },
        { text: 'Signs point to yes.', chance: 0.1 },
        { text: 'Reply hazy, try again.', chance: 0.1 },
        { text: 'Ask again later.', chance: 0.1 },
        { text: 'Better not tell you now.', chance: 0.1 },
        { text: 'Concentrate and ask again.', chance: 0.1 },
        { text: "Don't count on it.", chance: 0.1 },
        { text: 'My reply is no.', chance: 0.1 },
        { text: 'My sources say no.', chance: 0.1 },
        { text: 'Outlook not so good.', chance: 0.1 },
        { text: 'Very doubtful.', chance: 0.1 },
      ];
  
      let totalChance = 0;
      answers.forEach(answer => (totalChance += answer.chance));
  
      let randomValue = Math.random() * totalChance;
      let selectedAnswer;
      for (const answer of answers) {
        randomValue -= answer.chance;
        if (randomValue <= 0) {
          selectedAnswer = answer;
          break;
        }
      }
  
      message.channel.send(`🎱 **8-Ball**\n\n❓ Question: ${fetchQuestion}\n🗣 Answer: ${selectedAnswer.text}`);
    },
  };
  