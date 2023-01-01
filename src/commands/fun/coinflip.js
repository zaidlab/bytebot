const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription(
			'👛 Flip a coin',
		),
	async execute(interaction) {
		const options = ['Heads', 'Tails'];
		const result = options[Math.floor(Math.random() * options.length)];
		await interaction.reply('Flipping...');
		await wait(1000);
		await interaction.editReply(`${result}!`);

	},
};
