module.exports = {
    name: 'howgamer',
    description: 'Check your gamer level',
    execute(message, args, client) {
      const gamerPercentage = Math.floor(Math.random() * 101); // Generate a random percentage from 0 to 100
  
      const progressBar = generateProgressBar(gamerPercentage);
      const responseMessage = `You are ${gamerPercentage}% gamer:\n${progressBar}`;
  
      message.reply(responseMessage);
    },
  };
  
  // Helper function to generate a text-based progress bar
  function generateProgressBar(percentage) {
    const progressBarLength = 20;
    const filledBlocks = Math.floor((percentage / 100) * progressBarLength);
    const emptyBlocks = progressBarLength - filledBlocks;
  
    const progressBarString = `[${'█'.repeat(filledBlocks)}${' '.repeat(emptyBlocks)}] ${percentage}%`;
  
    return progressBarString;
  }
  