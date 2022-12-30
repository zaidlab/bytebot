// Pong!
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('🏓 Check the connection between your bot and the Discord server.'),
	async execute(interaction) {
		return interaction.reply('Pong!');
	},
};