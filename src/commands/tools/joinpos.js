// joinpos.js
const { Message } = require('discord.js');

module.exports = {
    name: 'joinpos',
    description: 'Displays your join position in the server.',
    execute(message = new Message()) {
        const memberList = message.guild.members.cache
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
            .map(member => member.id);
        const userJoinPosition = memberList.indexOf(message.author.id) + 1;
        const membersBefore = userJoinPosition - 1;
        const membersAfter = memberList.length - userJoinPosition;

        message.channel.send(`Your join position is ${userJoinPosition}. There are ${membersBefore} member(s) who joined before you, and ${membersAfter} member(s) who joined after you.`);
    },
};
