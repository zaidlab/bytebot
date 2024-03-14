module.exports = {
    name: 'me',
    description: 'ℹ️ Display information about yourself',
    execute(message) {
      try {
        const { guild, author } = message;
        const member = guild.members.cache.get(author.id);
  
        const joinDiscordDate = author.createdAt.toLocaleDateString(); // User's account creation date
        const joinServerDate = member.joinedAt.toLocaleDateString(); // User's join date to the server
        const nickname = member.nickname || 'None'; // User's nickname in the server
        const roles = member.roles.cache.filter(role => role.name !== '@everyone').sort((a, b) => b.position - a.position);
        const roleCount = roles.size;
        const userStatus = member.presence?.status || 'offline'; // User's current status
  
        const embed = {
          title: `Your information`,
          color: 0x3498db,
          fields: [
            { name: 'User ID', value: author.id, inline: true },
            { name: 'Nickname', value: nickname, inline: true },
            { name: 'Account Created On', value: joinDiscordDate, inline: true },
            { name: 'Joined Server On', value: joinServerDate, inline: true },
            { name: 'Status', value: userStatus, inline: true },
            { name: 'Roles', value: `(${roleCount})`, inline: true },
            // Optional: If you want to display a list of roles, uncomment the line below
            // { name: 'Roles List', value: roles.map(role => role.toString()).join(', '), inline: false },
          ],
          thumbnail: { url: author.displayAvatarURL({ dynamic: true }) },
          timestamp: new Date(),
          footer: {
            text: `Requested by ${author.tag}`,
            icon_url: author.displayAvatarURL({ dynamic: true }),
          },
        };
  
        message.channel.send({ embeds: [embed] });
      } catch (error) {
        console.error('Error getting user information:', error);
        message.reply('An error occurred while getting your information. Please try again later.');
      }
    },
  };
  