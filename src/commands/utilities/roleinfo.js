module.exports = {
    name: 'roleinfo',
    description: 'Lists information about a specific role',
    category: 'utility',
    usage: '!roleinfo <role>',
    async execute(message, args) {
      const query = args.join(' ').toLowerCase();
  
      if (!query) {
        return message.channel.send('You did not provide a role to search. (!roleinfo <role>)');
      }
  
      await message.guild.members.fetch();
      const rolesCache = message.guild.roles.cache;
      const role = rolesCache.find((r) => (
          r.name.toLowerCase().includes(query) || r.id === query
      ));
  
      if (!role) {
        return message.channel.send('Invalid Role');
      }
  
      return message.channel.send(`Role Information: ${role.name}\n${role.members.size} members have that role.`);
    },
  };
  