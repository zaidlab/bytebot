const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random-number-generator')
		.setDescription('Generates a random number for you')
		.addNumberOption(option =>
			option.setName('digit-length')
				.setDescription('How many digits the random number should have')
				.setRequired(true)),

	async execute(interaction) {
		const digitLength = interaction.options.getNumber('digit-length');
		function getRandomNumber(num) {
			let randomNumber = Math.floor(Math.random() * 9) + 1;
			for (let i = 1; i < num; i++) {
				randomNumber = randomNumber * 10 + Math.floor(Math.random() * 10);
			}
			return randomNumber;
		}
		const embed = new EmbedBuilder()
			.setDescription(`A number I've generated is **${getRandomNumber(digitLength)}**.`)
			.setColor('Random');
		interaction.reply({ embeds: [embed] });

	},
};
