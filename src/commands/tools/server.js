module.exports = {
    name: 'server',
    description: 'ℹ️ Display information about the server',
    execute(message) {
        try {
            const { guild } = message;

            const creationDate = guild.createdAt.toLocaleDateString(); // Use toLocaleDateString for better formatting
            const ownerTag = guild.owner ? guild.owner.user?.tag || 'N/A' : 'N/A';
            const onlineMembers = guild.members.cache.filter(member => member.presence?.status !== 'offline').size;
            const boostersCount = guild.premiumSubscriptionCount;
            const channelCount = guild.channels.cache.size;

            const verificationLevels = {
                NONE: 'None',
                LOW: 'Low',
                MEDIUM: 'Medium',
                HIGH: 'High',
                VERY_HIGH: 'Very High',
            };
            const verificationLevel = verificationLevels[guild.verificationLevel] || 'Unknown';

            const roles = guild.roles.cache.sort((a, b) => b.position - a.position);
            const roleCount = roles.size;

            const serverIcon = guild.iconURL({ dynamic: true }) || 'https://i.imgur.com/4M34hi2.png'; // Default icon if no icon is set

            const embed = {
                title: `${guild.name} Server Information`,
                color: 0x3498db,
                fields: [
                    { name: 'Server ID', value: guild.id, inline: true },
                    { name: 'Created On', value: creationDate, inline: true },
                    { name: 'Owned By', value: ownerTag, inline: true },
                    { name: 'Members', value: `${guild.memberCount} total, ${onlineMembers} online`, inline: true },
                    { name: 'Boosters', value: boostersCount.toString(), inline: true },
                    { name: 'Channels', value: channelCount.toString(), inline: true },
                    { name: 'Verification Level', value: verificationLevel, inline: true },
                    { name: 'Roles', value: `(${roleCount})`, inline: true },
                    // Optional: If you want to display a list of roles, uncomment the line below
                    // { name: 'Roles List', value: roles.map(role => role.name).join(', '), inline: false },
                ],
                thumbnail: { url: serverIcon },
                timestamp: new Date(),
                footer: {
                    text: `Requested by ${message.author.tag}`,
                    icon_url: message.author.displayAvatarURL({ dynamic: true }),
                },
            };

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error getting server information:', error);
            message.reply('An error occurred while getting server information. Please try again later.');
        }
    },
};
