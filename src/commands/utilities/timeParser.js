const ms = require('ms');

function parseTime(timeString) {
  try {
    return ms(timeString);
  } catch (error) {
    console.error('Error parsing time:', error);
    return null;
  }
}

module.exports = { parseTime };
