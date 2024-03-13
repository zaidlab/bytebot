const axios = require('axios');

module.exports = {
  name: 'weather',
  description: 'Get the current weather for a location',
  usage: 'weather <city>',
  async execute(message, args) {
    if (!args.length) {
      return message.channel.send('Please provide a city name. Usage: `!weather <city>`');
    }

    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    const city = args.join(' ');

    try {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
      const weatherData = response.data;

      const temperature = weatherData.main.temp - 273.15; // Convert temperature from Kelvin to Celsius
      const description = weatherData.weather[0].description;

      const weatherMessage = `Current weather in ${city}:\nTemperature: ${temperature.toFixed(2)}°C\nDescription: ${description}`;
      message.channel.send(weatherMessage);
    } catch (error) {
      console.error(`Error fetching weather data: ${error.message}`);
      message.channel.send('An error occurred while fetching weather data.');
    }
  },
};
