const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("🎱 Play 8ball with the bot")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("What the question is")
        .setRequired(true)
    ),
  async execute(interaction) {
    const fetchQuestion = interaction.options.getString("question");
    const answers = [
      "Yes, definately.",
      "For sure.",
      "Positive about it.",
      "Negative about it.",
      "You may rely on it.",
      "As I see it, yes.",
      "Most likely.",
      "Outlook good.",
      "Yes.",
      "Signs point to yes.",
      "Reply hazy, try again.",
      "Ask again later.",
      "Better not tell you now.",
      "Concentrate and ask again.",
      "Don't count on it.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good.",
      "Very doubtful.",
    ];
    const embed = new EmbedBuilder()
      .setTitle("🎱 8-Ball")
      .addFields(
        { name: "❓ Question", value: fetchQuestion },
        {
          name: "🗣 Answer",
          value: answers[Math.floor(Math.random() * answers.length)],
        }
      )
      .setColor("Random");
    interaction.reply({ embeds: [embed] });
  },
};
