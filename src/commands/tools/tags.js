// bytebot/commands/tags.js
const fs = require('fs');
const path = require('path');

const tagsFilePath = path.join(__dirname, '..', '..', 'database', 'tagsdb.json'); // Updated file path

module.exports = {
  name: 'tag',
  description: 'Manage tags',
  execute(message, args, client) {
    const subcommand = args[0];

    switch (subcommand) {
      case 'create':
        createTagCommand(message, args.slice(1));
        break;
      case 'edit':
        editTagCommand(message, args.slice(1));
        break;
      case 'delete':
        deleteTagCommand(message, args.slice(1));
        break;
      case 'list':
        listTagsCommand(message);
        break;
      case 'raw':
        getRawTagCommand(message, args.slice(1));
        break;
      default:
        viewTagCommand(message, args);
    }
  },
};

function loadTags() {
  try {
    const data = fs.readFileSync(tagsFilePath, 'utf8');

    if (!data) {
      return {};
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading tags:', error);
    return {};
  }
}

function saveTags(tags) {
  try {
    const tagsString = JSON.stringify(tags, null, 2);
    fs.writeFileSync(tagsFilePath, tagsString);
  } catch (error) {
    console.error('Error saving tags:', error);
  }
}

function viewTagCommand(message, args) {
  const userId = message.author.id;
  const tagName = args[0];

  if (!tagName) {
    return message.reply('Please provide a tag name.');
  }

  const tags = loadTags();
  const userTags = tags[userId] || {};

  if (!userTags.hasOwnProperty(tagName)) {
    return message.reply(`Tag \`${tagName}\` not found.`);
  }

  message.channel.send(userTags[tagName]);
}

function listTagsCommand(message) {
  const userId = message.author.id;
  const tags = loadTags();
  const userTags = tags[userId] || {};

  if (Object.keys(userTags).length > 0) {
    const tagList = Object.keys(userTags).join(', ');
    message.channel.send(`Tag list: ${tagList}`);
  } else {
    message.reply('No tags found.');
  }
}

function createTagCommand(message, args) {
  const userId = message.author.id;
  const tagName = args[0];
  const tagContent = args.slice(1).join(' ');

  if (!tagName || !tagContent) {
    return message.reply('Please provide a tag name and content.');
  }

  const tags = loadTags();
  const userTags = tags[userId] || {};

  if (userTags.hasOwnProperty(tagName)) {
    return message.reply(`Tag \`${tagName}\` already exists. Use \`tag edit\` to modify it.`);
  }

  userTags[tagName] = tagContent;
  tags[userId] = userTags;
  saveTags(tags);
  message.reply(`Tag \`${tagName}\` created successfully.`);
}

function editTagCommand(message, args) {
  const userId = message.author.id;
  const tagName = args[0];
  const newTagContent = args.slice(1).join(' ');

  if (!tagName || !newTagContent) {
    return message.reply('Please provide a tag name and new content.');
  }

  const tags = loadTags();
  const userTags = tags[userId] || {};

  if (!userTags.hasOwnProperty(tagName)) {
    return message.reply(`Tag \`${tagName}\` not found. Use \`tag create\` to create it.`);
  }

  userTags[tagName] = newTagContent;
  tags[userId] = userTags;
  saveTags(tags);
  message.reply(`Tag \`${tagName}\` edited successfully.`);
}

function deleteTagCommand(message, args) {
  const userId = message.author.id;
  const tagName = args[0];

  if (!tagName) {
    return message.reply('Please provide a tag name to delete.');
  }

  const tags = loadTags();
  const userTags = tags[userId] || {};

  if (!userTags.hasOwnProperty(tagName)) {
    return message.reply(`Tag \`${tagName}\` not found.`);
  }

  delete userTags[tagName];
  tags[userId] = userTags;
  saveTags(tags);
  message.reply(`Tag \`${tagName}\` deleted successfully.`);
}

function getRawTagCommand(message, args) {
  const userId = message.author.id;
  const tagName = args[0];

  if (!tagName) {
    return message.reply('Please provide a tag name for raw content.');
  }

  const tags = loadTags();
  const userTags = tags[userId] || {};

  if (!userTags.hasOwnProperty(tagName)) {
    return message.reply(`Tag \`${tagName}\` not found.`);
  }

  message.channel.send(`\`\`\`${userTags[tagName]}\`\`\``);
}
