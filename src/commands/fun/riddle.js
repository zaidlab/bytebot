// bytebot/commands/fun/riddle.js
const fs = require('fs').promises;
const path = require('path');

// Set to store users who have received a riddle
const usersWithRiddles = new Set();

const riddleFilePath = path.join(__dirname, '..', '..', 'database', 'riddledb.json');

module.exports = {
  name: 'riddle',
  description: '🤔 Get a random riddle!',
  cooldown: 30, // Cooldown in seconds
  shuffleChance: 0.3, // 30% chance of shuffling riddles
  executed: new Set(),

  execute: async function (message) {
    // Check if the user is already engaged in an active riddle
    if (usersWithRiddles.has(message.author.id)) {
      message.reply('You are already engaged in an active riddle. Please finish or wait for it to timeout before starting a new one.');
      return;
    }

    // Check if the user's message matches the command
    if (message.content.toLowerCase().startsWith('!riddle')) {
      // Check if the user has already received a riddle recently
      if (this.executed.has(message.author.id)) {
        message.reply('You recently received a riddle. Wait for a while before getting another one.');
        return;
      }
    }

    try {
      const riddleData = await loadRiddleData();

      // Randomly shuffle riddles based on the shuffle chance
      if (Math.random() < this.shuffleChance) {
        shuffleArray(riddleData);
      }

      // Get a random riddle
      const randomRiddle = riddleData[0];

      // Create an embed for the riddle
      const embed = {
        title: 'Riddle Time!',
        color: 0x3498db,
        description: `**${randomRiddle.question}**`,
        fields: [
          { name: 'Type your answer below:', value: '*Hint: Use lowercase and no punctuation.*' },
        ],
        timestamp: new Date(),
        footer: {
          text: 'Requested by ' + message.author.tag,
          icon_url: message.author.displayAvatarURL({ dynamic: true }),
        },
      };

      // Send the embed to the Discord channel
      const sentMessage = await message.channel.send({ embeds: [embed] });

      // Set up a message collector to listen for the answer
      const collector = message.channel.createMessageCollector({
        filter: m => m.author.id === message.author.id,
        time: this.cooldown * 1000, // Cooldown time in milliseconds
        max: 1, // Allow only one answer
      });

      // Add the user to the set after receiving a riddle
      usersWithRiddles.add(message.author.id);
      this.executed.add(message.author.id);

      collector.on('collect', async (collected) => {
        // Check if the answer is correct (ignoring '?')
        const userAnswer = collected.content.toLowerCase().replace(/\?/g, '').trim();
        const correctAnswer = randomRiddle.answer.toLowerCase().replace(/\?/g, '').trim();

        // Send a new message with the result
        if (userAnswer === correctAnswer) {
          await message.channel.send(`🎉 Correct! The answer is ${randomRiddle.answer}.`);
        } else {
          await message.channel.send(`❌ Incorrect! The correct answer is ${randomRiddle.answer}.`);
        }

        collector.stop();
      });

      collector.on('end', (collected, reason) => {
        // Remove the user from the set after the cooldown period
        setTimeout(() => {
          usersWithRiddles.delete(message.author.id);
          this.executed.delete(message.author.id);
        }, this.cooldown * 1000);

        // Check if the reason is 'time' and the user hasn't provided an answer
        if (reason === 'time' && !collected.size) {
          // Send a new message with the timeout result
          message.channel.send(`⌛ Time's up! The riddle answer was ${randomRiddle.answer}.`);
        }
      });
    } catch (error) {
      console.error('Error loading riddle data:', error);
      message.reply('An error occurred while loading riddle data. Please try again later.');
    }
  },
};

// Function to load riddle data from the riddledb.json file
async function loadRiddleData() {
  try {
    const data = await fs.readFile(riddleFilePath, 'utf8');

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading riddles:', error);
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
