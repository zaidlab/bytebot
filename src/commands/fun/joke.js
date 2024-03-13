const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "How do you organize a space party? You planet!",
    // Add more regular jokes to the array as needed
  ];
  
  const specialJokes = [
    "Why did the computer go to therapy? It had too many bytes of emotional baggage!",
    "Why did the coffee file a police report? It got mugged!",
    // Add more special jokes to the array as needed
  ];
  
  module.exports = {
    name: "joke",
    description: "😄 Get a random joke",
    execute(message) {
      // Random chance (e.g., 30%) to display a special joke
      const isSpecialJoke = Math.random() < 0.3;
  
      let randomJoke;
      if (isSpecialJoke && specialJokes.length > 0) {
        const randomIndex = Math.floor(Math.random() * specialJokes.length);
        randomJoke = specialJokes[randomIndex];
      } else {
        const randomIndex = Math.floor(Math.random() * jokes.length);
        randomJoke = jokes[randomIndex];
      }
  
      message.channel.send(`Here's a joke for you:\n${randomJoke}`);
    },
  };
  