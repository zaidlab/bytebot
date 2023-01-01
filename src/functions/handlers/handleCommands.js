const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config();

module.exports = (client) => {
	client.handleCommands = async () => {
		const commandFolders = fs.readdirSync('./src/commands');
		for (const folder of commandFolders) {
			const commandFiles = fs
				.readdirSync(`./src/commands/${folder}`)
				.filter((file) => file.endsWith('.js'));

			const { commands, commandArray } = client;
			for (const file of commandFiles) {
				const command = require(`../../commands/${folder}/${file}`);
				commands.set(command.data.name, command);
				commandArray.push(command.data.toJSON());
				// console.log('Command:  ${command.data.name} has been passed through the handler');
			}
		}

		// right click bot and choose copy id
		const clientId = process.env.clientid;
		// used if you only want the bot to be used in a specific server
		// right click on server and choose copy id
		const guildId = process.env.guildid;
		const rest = new REST({ version: '9' }).setToken(process.env.token);
		try {
			console.log('Started refreshing application (/) commands.');

			// use applicationGuildCommands(clientId,guildId) if you only want the bot in a specific server
			// otherwise use applicationCommands(guildId)
			// if applicationCommands() is used, commands might take time to update for all servers
			await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
				body: client.commandArray,
			});

			console.log('Successfully reloaded application (/) commands.');
		}
		catch (error) {
			console.error(error);
		}
	};
};
