// commands/pcpartpicker/hw.js
const fs = require('fs');
const { MessageCollector } = require('discord.js');

const HW_FILE_PATH = './commands/userhw/hwdb.json';

// Load hardware information from the file
let hardwareMap = loadHardwareMap();

function loadHardwareMap() {
  try {
    if (!fs.existsSync(HW_FILE_PATH)) {
      console.error('Hardware information file not found. Creating a new one.');
      return new Map();
    }

    const data = fs.readFileSync(HW_FILE_PATH, 'utf8');

    if (!data.trim()) {
      console.error('Hardware information file is empty. Creating a new one.');
      return new Map();
    }

    const parsedData = JSON.parse(data);

    if (Array.isArray(parsedData)) {
      return new Map(parsedData);
    } else {
      console.error('Invalid format in hardware information file. Creating a new one.');
      return new Map();
    }
  } catch (error) {
    console.error('Error loading hardware information:', error);
    return new Map();
  }
}

function saveHardwareMap() {
  try {
    const data = JSON.stringify([...hardwareMap]);
    fs.writeFileSync(HW_FILE_PATH, data, 'utf8');
  } catch (error) {
    console.error('Error saving hardware information:', error);
  }
}

module.exports = {
  name: 'hw',
  description: 'Manage hardware information',
  execute(message, args) {
    // Ensure the user has a hardware list
    let userHardwareLists = hardwareMap.get(message.author.id);

    if (!userHardwareLists) {
      userHardwareLists = [];
      hardwareMap.set(message.author.id, userHardwareLists);
    } else if (!Array.isArray(userHardwareLists)) {
      // Convert to an array if it's not already
      userHardwareLists = [userHardwareLists];
      hardwareMap.set(message.author.id, userHardwareLists);
    }

    if (!args.length) {
      // Display the default hardware if available
      const defaultHardware = userHardwareLists.find(hw => hw.default);

      if (defaultHardware) {
        return message.channel.send(`__${message.author.username}'s ${defaultHardware.name}__
${defaultHardware.text}`);
      } else if (userHardwareLists.length > 0) {
        // Set the first hardware list as default if not set
        userHardwareLists[0].default = true;
        saveHardwareMap();
        return message.channel.send(`__${message.author.username}'s ${userHardwareLists[0].name}__
${userHardwareLists[0].text}`);
      } else {
        return message.reply('You do not have any hardware lists created yet. Please use `!hw new` to create one.');
      }
    }

    const subCommand = args[0].toLowerCase();

    switch (subCommand) {
      case 'new':
        // Prompt the user to create a new hardware list
        message.reply('What should I call the hardware list?');

        const nameCollector = message.channel.createMessageCollector({
          filter: (msg) => msg.author.id === message.author.id,
          time: 60000,
          max: 1,
        });

        nameCollector.on('collect', (msg) => {
          const listName = msg.content.trim();

          if (!listName) {
            return message.reply('Invalid list name. Please provide a valid name.');
          }

          // Ask for the content to be displayed
          message.reply(`What content should be displayed for **${message.author.username}'s ${listName}**?`);

          const contentCollector = message.channel.createMessageCollector({
            filter: (msg) => msg.author.id === message.author.id,
            time: 60000,
            max: 1,
          });

          contentCollector.on('collect', (contentMsg) => {
            const textToDisplay = contentMsg.content.trim();

            if (!textToDisplay) {
              return message.reply('Invalid content. Please provide valid content.');
            }

            // Create a new hardware information entry
            const newHardware = { name: listName, text: textToDisplay, default: false };
            userHardwareLists.push(newHardware);
            saveHardwareMap();
            message.channel.send(`Hardware information "${listName}" created.`);
          });

          contentCollector.on('end', (_, reason) => {
            if (reason === 'time') {
              message.reply('You took too long to respond. Command cancelled.');
            }
          });
        });

        nameCollector.on('end', (_, reason) => {
          if (reason === 'time') {
            message.reply('You took too long to respond. Command cancelled.');
          }
        });
        break;

      case 'list':
        // Display a list of hardware lists
        if (userHardwareLists.length === 0) {
          return message.reply('You do not have any hardware lists created yet. Please use `!hw new` to create one.');
        }

        const userLists = userHardwareLists.map((hw, index) => `${index + 1} - ${hw.name}`).join('\n');
        return message.channel.send(`__${message.author.username}'s lists:__
${userLists}`);
        break;

      case 'default':
        // Set a specific hardware list as default
        if (args.length === 2) {
          const listNumber = parseInt(args[1], 10);

          if (isNaN(listNumber) || listNumber <= 0 || listNumber > userHardwareLists.length) {
            return message.reply('Invalid list number. Please provide a valid number.');
          }

          userHardwareLists.forEach(hw => (hw.default = false)); // Clear existing default flag

          const selectedList = userHardwareLists[listNumber - 1];
          selectedList.default = true;
          saveHardwareMap();

          return message.reply(`Default hardware set to "${selectedList.name}".`);
        } else {
          return message.reply('Please provide a valid list number.');
        }
        break;

      case 'remove':
        // Remove a specific hardware list
        if (args.length === 2) {
          const listNameToRemove = args[1].toLowerCase();
          const indexToRemove = userHardwareLists.findIndex(hw => hw.name.toLowerCase() === listNameToRemove);

          if (indexToRemove !== -1) {
            userHardwareLists.splice(indexToRemove, 1);
            saveHardwareMap();
            return message.reply(`Hardware information "${listNameToRemove}" removed.`);
          } else {
            return message.reply(`The hardware list "${listNameToRemove}" does not exist.`);
          }
        } else {
          return message.reply('Please provide a valid list name to remove.');
        }
        break;

      default:
        const listNumber = parseInt(subCommand, 10);

        if (!isNaN(listNumber) && listNumber > 0 && listNumber <= userHardwareLists.length) {
          const selectedList = userHardwareLists[listNumber - 1];
          return message.channel.send(`__${message.author.username}'s ${selectedList.name}__
${selectedList.text}`);
        } else {
          return message.reply('Invalid sub-command. Available sub-commands: new, list, default, remove.');
        }
    }
  },
};
