const axios = require('axios');

module.exports = {
  name: 'covid',
  description: 'Get COVID-19 stats',
  async execute(message, args, client) {
    const subcommand = args[0];
    const location = args.slice(1).join(' ');

    try {
      let response;
      let url;

      switch (subcommand) {
        case 'country':
          url = `https://api.covid-api.com/v3/covid-19/countries/${location}`;
          response = await axios.get(url);
          break;
        case 'state':
          url = `https://api.covid-api.com/v3/covid-19/regions/${location}`;
          response = await axios.get(url);
          break;
        default:
          url = 'https://api.covid-api.com/v3/covid-19/world';
          response = await axios.get(url);
      }

      const data = response.data;

      if (!data || data.length === 0) {
        return message.reply('No data found for the specified location.');
      }

      const latestData = data[0];

      let statsMessage = `**COVID-19 Stats**\n`;

      if (subcommand === 'country' || subcommand === 'state') {
        statsMessage += `Location: ${latestData.country || latestData.region}\n`;
      }

      statsMessage += `Confirmed: ${latestData.cases.total}\n`;
      statsMessage += `Deaths: ${latestData.deaths.total}\n`;
      statsMessage += `Recovered: ${latestData.cases.recovered}\n`;
      statsMessage += `Active Cases: ${latestData.cases.active}\n`;

      message.channel.send(statsMessage);
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while fetching COVID-19 stats.');
    }
  },
};
