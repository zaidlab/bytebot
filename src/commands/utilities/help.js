const { readdirSync, statSync } = require('fs');
const { join } = require('path');

module.exports = {
    name: 'help',
    description: '🤖 Display a list of available commands',
    execute(message, args) {
        console.log(`Executing help command for user: ${message.author.tag}`);

        // If no category is provided, show the categories
        if (!args.length) {
            const categories = readdirSync(join(__dirname, '..'))
                .filter(dir => statSync(join(__dirname, '..', dir)).isDirectory());

            let helpMessage = 'Command Categories:\n';
            categories.forEach((category, index) => {
                helpMessage += `${index + 1}. ${category}\n`;
            });
            helpMessage += '\nType "!help <category>" to see commands in a specific category. (case sensitive)\n';

            // Send the help message to the Discord channel
            message.channel.send(helpMessage);
            return;
        }

        // If a category is provided, show commands in that category
        const category = args[0].toLowerCase(); // Assuming categories are case-insensitive
        let categoryCommands = '';

        // Function to recursively read command files from a directory
        const readCommands = (dir, currentCategory) => {
            const commandFiles = readdirSync(dir);
            for (const file of commandFiles) {
                const filePath = join(dir, file).replace(/\\/g, '/');
                if (statSync(filePath).isDirectory()) {
                    // If it's a directory, recursively read commands
                    readCommands(filePath, currentCategory ? `${currentCategory}/${file}` : file);
                } else if (file.endsWith('.js') && file !== 'help.js') {
                    try {
                        const command = require(filePath);
                        if (currentCategory && currentCategory.toLowerCase() === category) {
                            // Accumulate commands in the specified category
                            categoryCommands += `**${currentCategory ? currentCategory + '/' : ''}${command.name}**: ${command.description || 'No description available'}\n`;
                        }
                    } catch (error) {
                        console.error(`Error loading command: ${error.message}`);
                    }
                }
            }
        };

        // Get the absolute path of the 'commands' directory
        const commandsPath = join(__dirname, '../');

        // Read commands from the 'commands' directory and its subdirectories
        readCommands(commandsPath);

        // Check if any commands were found for the specified category
        if (categoryCommands === '') {
            message.channel.send(`No commands found for category: ${category}`);
        } else {
            // Send all accumulated category commands to the Discord channel at once
            message.channel.send(categoryCommands);
        }
    },
};
