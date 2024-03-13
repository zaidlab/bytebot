// Map to store the last execution time of the command for each user
const cooldowns = new Map();

module.exports = {
  name: 'pizza',
  description: 'Simulates the preparation of a pizza with an editing progress bar.',
  cooldown: 30, // Cooldown time in seconds
  execute: async (message) => {
    // Check cooldown
    if (cooldowns.has(message.author.id)) {
      const expirationTime = cooldowns.get(message.author.id) + (module.exports.cooldown * 1000);

      if (Date.now() < expirationTime) {
        const timeLeft = (expirationTime - Date.now()) / 1000;
        return message.reply(`Please wait ${timeLeft.toFixed(1)} more seconds before using the \`pizza\` command again.`);
      }
    }

    // Set the last execution time for the user
    cooldowns.set(message.author.id, Date.now());

    // Send a message to indicate the progress bar is starting
    const progressMessage = await message.channel.send('Preparing your pizza...');

    // Set the total number of steps for the progress bar
    const totalSteps = 10;

    // Simulate the pizza preparation with a loop
    for (let step = 0; step <= totalSteps; step++) {
      // Calculate the progress percentage
      const progress = (step / totalSteps) * 100;

      // Calculate the number of filled squares in the progress bar
      const filledSquares = Math.round((step / totalSteps) * 10);

      // Create the formatted progress bar
      const progressBar = `[${'█'.repeat(filledSquares)}${' '.repeat(10 - filledSquares)}] ${progress.toFixed(0)}%`;

      // Edit the message to update the progress bar
      await progressMessage.edit(`${progressBar} - Baking in the oven...`);

      // Wait for a short duration (you can adjust this based on your preference)
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Edit the message to indicate that the pizza is ready
    await progressMessage.edit('🍕 Your pizza is ready! Bon appétit! https://tenor.com/view/pizza-pepperoni-pizza-gif-22902497');
  },
};
