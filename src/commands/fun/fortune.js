// bytebot/commands/fun/fortune.js
const fs = require('fs');
const path = require('path');

const fortuneFilePath = path.join(__dirname, '..', '..', 'database', 'fortunedb.json'); // Updated file path

module.exports = {
  name: 'fortune',
  description: '🔮 Get a random fortune!',
  cooldown: 10, // Cooldown in seconds
  shuffleChance: 0.3, // 30% chance of shuffling fortunes
  executed: new Set(),

  execute: async function (message) {
    // Check if the user has already received a fortune recently
    if (this.executed.has(message.author.id)) {
      message.reply('You recently received a fortune. Wait for a while before getting another one.');
      return;
    }

    try {
      // Load fortunes from the fortunedb.json file
      let fortunes = loadFortunes();

      // Randomly shuffle fortunes based on the shuffle chance
      if (Math.random() < this.shuffleChance) {
        fortunes = shuffleArray(fortunes);
      }

      // Get a random fortune
      const randomFortune = fortunes[0];

      // Send the fortune to the user
      message.reply(`🔮 Your fortune: ${randomFortune}`);

      // Add the user to the set after receiving a fortune
      this.executed.add(message.author.id);

      // Remove the user from the set after the cooldown period
      setTimeout(() => {
        this.executed.delete(message.author.id);
      }, this.cooldown * 1000);
    } catch (error) {
      console.error('Error getting fortune:', error);
      message.reply('An error occurred while getting your fortune. Please try again later.');
    }
  },
};

// Function to load fortunes from fortunedb.json
function loadFortunes() {
  try {
    const data = fs.readFileSync(fortuneFilePath, 'utf8');

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading fortunes:', error);
    return [];
  }
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}
