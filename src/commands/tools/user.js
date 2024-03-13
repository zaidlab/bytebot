module.exports = {
    name: 'user',
    description: 'ℹ️ Display information about a user',
    execute(message, args) {
        try {
            console.log(`Executing userinfo command by ${message.author.tag}`);

            // Get the mentioned user or the user who sent the command
            const targetUser = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user || message.author;

            console.log(`Target user: ${targetUser.tag}`);

            // Extract user information
            const { id, username, discriminator, tag, displayAvatarURL, createdAt, presence } = targetUser;
            const joinedAt = message.guild.members.cache.get(targetUser.id)?.joinedAt.toDateString() || 'Not available';
            const status = presence ? presence.status : 'Offline';

            console.log('User information extracted successfully');

            const embed = {
                title: `User Information for ${tag}`,
                color: 0x3498db,
                thumbnail: { url: displayAvatarURL({ dynamic: true }) || 'https://i.imgur.com/4M34hi2.png' }, // Default avatar if no avatar is set
                fields: [
                    { name: 'User ID', value: id, inline: true },
                    { name: 'Username', value: username, inline: true },
                    { name: 'Discriminator', value: discriminator, inline: true },
                    { name: 'Tag', value: tag, inline: true },
                    { name: 'Account Created On', value: createdAt.toDateString(), inline: true },
                    { name: 'Joined Server On', value: joinedAt, inline: true },
                    { name: 'Status', value: status, inline: true },
                ],
                timestamp: new Date(),
                footer: {
                    text: `Requested by ${message.author.tag}`,
                    icon_url: message.author.displayAvatarURL({ dynamic: true }),
                },
            };

            console.log('Embed created successfully');

            message.channel.send({ embeds: [embed] });

            console.log('Userinfo command completed successfully');
        } catch (error) {
            console.error('Error getting user information:', error);
            message.reply('An error occurred while getting user information. Please try again later.');
        }
    },
};
