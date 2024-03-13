const axios = require('axios');

module.exports = {
  name: 'currency',
  description: 'Convert currencies',
  category: 'utility',
  usage: '!currency <amount> <from_currency> <to_currency>',
  async execute(message, args) {
    if (args.length !== 3) {
      return message.reply({ content: '❌ | Invalid syntax. Use `!currency <amount> <from_currency> <to_currency>`' });
    }

    const [amount, fromCurrency, toCurrency] = args;

    try {
      const apiKey = 'YOUR_EXCHANGE_RATE_API_KEY'; // Replace with your ExchangeRate-API key
      const apiUrl = `https://open.er-api.com/v6/latest/${fromCurrency.toUpperCase()}`;

      const response = await axios.get(apiUrl);
      const exchangeRates = response.data.rates;

      if (!(fromCurrency.toUpperCase() in exchangeRates) || !(toCurrency.toUpperCase() in exchangeRates)) {
        return message.reply({ content: '❌ | Invalid currency codes provided' });
      }

      const fromRate = exchangeRates[fromCurrency.toUpperCase()];
      const toRate = exchangeRates[toCurrency.toUpperCase()];

      const convertedAmount = (amount * toRate) / fromRate;

      message.reply({
        content: `💰 | ${amount} ${fromCurrency.toUpperCase()} is approximately ${convertedAmount.toFixed(2)} ${toCurrency.toUpperCase()}`,
      });
    } catch (error) {
      console.error(error);
      message.reply({ content: '❌ | An error occurred while fetching exchange rates' });
    }
  },
};
