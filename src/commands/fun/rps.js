// Rock, Papers, Scissors!
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("✂️ Play Rock, Papers, Scissors")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("What is your choice?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const fetchQuestion = interaction.options.getString("choice");
    const answers = ["Rock", "Paper", "Scissors"];
    const embed = new EmbedBuilder()
      .setTitle("✂️ Rock Paper, Scissors")
      .addFields(
        { name: "Your Choice", value: fetchQuestion },
        {
          name: "My Choice",
          value: answers[Math.floor(Math.random() * answers.length)],
        }
      )
      .setColor("Random");
    interaction.reply({ embeds: [embed] });
  },
};
