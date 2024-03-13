// ismuted.js
const fs = require('fs');
const path = require('path');
const { Message } = require('discord.js');

const mutedUsersFilePath = path.join(__dirname, '../../database/mutedUsers.json');

module.exports = {
    name: 'ismuted',
    description: 'Displays the current muted users.',
    execute(message = new Message()) {
        fs.readFile(mutedUsersFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file from disk: ${err}`);
                message.channel.send('An error occurred while trying to retrieve the muted users.');
            } else {
                const mutedUsers = JSON.parse(data);
                if (Object.keys(mutedUsers).length === 0) {
                    message.channel.send('No users are currently muted.');
                } else {
                    let reply = 'Currently muted users:\n';
                    const currentTime = Date.now();
                    Object.keys(mutedUsers).forEach(userId => {
                        const { timestamp, duration, reason } = mutedUsers[userId];
                        const endTime = timestamp + duration;
                        const timeLeft = endTime > currentTime ? endTime - currentTime : 0;
                        const timeLeftStr = timeLeft ? `${Math.ceil(timeLeft / 60000)} minute(s)` : 'indefinite';
                        reply += `<@${userId}> - Reason: ${reason}, Time left: ${timeLeftStr}\n`;
                    });
                    message.channel.send(reply);
                }
            }
        });
    },
};
