const axios = require("axios");

module.exports = {
  name: "cat",
  description: "🖥️ Get a random post with image from r/cats (i think)",
  async execute(message) {
    try {
      let post = null;

      // Keep fetching random posts until we find one with an image
      while (!post || !post.url_overridden_by_dest || !post.url_overridden_by_dest.match(/\.(jpeg|jpg|gif|png)$/) || post.stickied) {
        const response = await axios.get("https://www.reddit.com/r/supermodelcats/random.json");
        post = response.data[0].data.children[0].data;
      }

      // Create an embed with the post information
      const embed = {
        title: post.title,
        url: `https://www.reddit.com${post.permalink}`,
        image: { url: post.url_overridden_by_dest },
        footer: { text: `👍 ${post.ups} | 💬 ${post.num_comments}` },
      };

      // Send the embed to the Discord channel
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply("Failed to fetch a random post with image from r/pcmasterrace. Please try again later.");
    }
  },
};
