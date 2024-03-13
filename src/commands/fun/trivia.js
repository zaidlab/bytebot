// bytebot/commands/fun/trivia.js
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  name: 'trivia',
  description: 'Test your knowledge with trivia!',
  cooldown: 30, // in seconds
  executed: new Set(),

  async execute(message) {
    // Check if the user is already engaged in an active trivia round
    if (this.executed.has(message.author.id)) {
      message.reply('You are already playing trivia! Wait for the current round to finish.');
      return;
    }

    try {
      const triviaData = await loadTriviaData();
      const categories = Object.keys(triviaData);

      // Prompt the user to choose a category
      message.channel.send(`Choose a category:\n${categories.map((category, index) => `${index + 1}. ${category}`).join('\n')}`);

      const filter = (response) => response.author.id === message.author.id;
      const collector = message.channel.createMessageCollector({ filter, time: this.cooldown * 1000 });

      collector.on('collect', async (response) => {
        const choice = parseInt(response.content);

        if (!isNaN(choice) && choice > 0 && choice <= categories.length) {
          const selectedCategory = categories[choice - 1];
          const { questions } = triviaData[selectedCategory];

          // Shuffle the questions array
          shuffleArray(questions);

          // Get a random question
          const { question, answer } = questions[0];

          message.channel.send(`**Trivia - ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}**\n${question}`);

          const answerCollector = message.channel.createMessageCollector({ filter, time: 15000 });

          answerCollector.on('collect', (response) => {
            const userAnswer = response.content.toLowerCase();
            const isCorrect = userAnswer === answer.toLowerCase();

            // Send a new message with the result
            response.reply(isCorrect ? 'Correct! You earn +10 virtual points!' : `Sorry, the correct answer is: ${answer}`);
            answerCollector.stop();
          });

          answerCollector.on('end', (collected, reason) => {
            // Check if the reason is 'time' and the user hasn't provided an answer
            if (reason === 'time' && !collected.size) {
              // Send a new message with the timeout result
              message.channel.send(`Time's up! The correct answer was: ${answer}`);
            }
          });

          this.executed.add(message.author.id);
          collector.stop();
        } else {
          // If the choice is invalid, notify the user and end the collector
          message.reply('Invalid choice. Please choose a valid category number.');
          collector.stop();
        }
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time' && !collected.size) {
          // Send a new message with the timeout result
          message.channel.send(`Time's up! Please use \`!trivia\` to start again.`);
        }
        this.executed.delete(message.author.id);
      });
    } catch (error) {
      console.error('Error loading trivia data:', error);
      message.reply('An error occurred while loading trivia data. Please try again later.');
    }
  },
};

// Function to load trivia data from the triviadb.json file
async function loadTriviaData() {
  const triviaFilePath = path.join(__dirname, '..', '..', 'database', 'triviadb.json');

  try {
    const data = await fs.readFile(triviaFilePath, 'utf8');

    if (!data) {
      return {};
    }

    const triviaData = JSON.parse(data);

    // Shuffle questions within each category
    for (const category in triviaData) {
      shuffleArray(triviaData[category].questions);
    }

    return triviaData;
  } catch (error) {
    console.error('Error loading trivia data:', error);
    return {};
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
