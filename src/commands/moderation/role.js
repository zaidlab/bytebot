// role.js
const roleShortcuts = {
    s: '1179925994505781341',  // Replace with the actual ID of the admin role
    moderator: '987654321098765432',  // Replace with the actual ID of the moderator role
  };
  
  module.exports = {
    name: 'role',
    description: 'Add or remove roles from mentioned users (admin, moderator, etc.)',
    execute(message, args) {
      // Check if the user has at least one of the specified roles
      const allowedRoles = ['Administrator', 'PC Mastermind'];  // Add role names that are allowed to use the command
      if (!allowedRoles.some(role => message.member.roles.cache.some(userRole => userRole.name === role))) {
        return message.reply('You do not have permission to use this command.');
      }
  
      // Check if the command has the correct number of arguments
      if (args.length < 3) {
        return message.reply('Usage: !role add/remove (user) (role/shortcut)');
      }
  
      // Get the subcommand ('add' or 'remove')
      const subcommand = args[0].toLowerCase();
  
      // Get the mentioned user
      const user = message.mentions.members.first();
  
      // Get the role or shortcut name
      const roleOrShortcut = args[2].toLowerCase();
  
      // Check if a user is mentioned
      if (!user) {
        return message.reply('Please mention a user.');
      }
  
      // Determine the role ID based on the role or shortcut name
      const roleId = roleShortcuts[roleOrShortcut] || roleOrShortcut;
  
      // Check if the mentioned user has the specified role
      if (!user.roles.cache.some(role => role.id === roleId)) {
        if (subcommand === 'remove') {
          return message.reply(`User ${user.user.tag} does not have the role ${roleOrShortcut}.`);
        }
      } else {
        if (subcommand === 'add') {
          return message.reply(`User ${user.user.tag} already has the role ${roleOrShortcut}.`);
        }
      }
  
      try {
        // Add or remove the role based on the subcommand
        if (subcommand === 'add') {
          user.roles.add(roleId);
          message.reply(`Role ${roleOrShortcut} added to ${user.user.tag}.`);
        } else if (subcommand === 'remove') {
          user.roles.remove(roleId);
          message.reply(`Role ${roleOrShortcut} removed from ${user.user.tag}.`);
        }
      } catch (error) {
        console.error(`Error modifying roles: ${error.message}`);
        message.reply('There was an error modifying roles.');
      }
    },
  };
  