module.exports = {
  name: 'remindme',
  description: 'Set a reminder',
  execute(message, args, client) {
    // Check if the user provided both a reminder and a time
    if (args.length < 2) {
      return message.reply('Please provide a reminder and a time. Example: `!remindme Buy groceries 1h`');
    }

    const reminder = args.slice(0, args.length - 1).join(' ');
    const time = args[args.length - 1];

    // Parse the time provided by the user (e.g., 1h, 30m)
    const parsedTime = parseTime(time);

    if (!parsedTime) {
      return message.reply('Invalid time format. Example: `1h` or `30m`');
    }

    const reminderTime = new Date(Date.now() + parsedTime);

    // Schedule the reminder
    setTimeout(() => {
      // Send a reminder message
      message.reply(`🔔 Reminder: ${reminder}`);
    }, parsedTime);

    message.reply(`Reminder set! I will remind you about "${reminder}" in ${formatTime(parsedTime)}.`);
  },
};

// Helper function to parse time provided by the user
function parseTime(timeString) {
  const match = timeString.match(/^(\d+)(h|m)$/);

  if (!match || parseInt(match[1]) <= 0) {
    return null;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  if (unit === 'h') {
    return value * 60 * 60 * 1000; // Convert hours to milliseconds
  } else if (unit === 'm') {
    return value * 60 * 1000; // Convert minutes to milliseconds
  }

  return null;
}

// Helper function to format time in a human-readable way
function formatTime(milliseconds) {
  const hours = Math.floor(milliseconds / (60 * 60 * 1000));
  const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));

  let formattedTime = '';

  if (hours > 0) {
    formattedTime += `${hours} hour${hours > 1 ? 's' : ''}`;
  }

  if (minutes > 0) {
    formattedTime += ` ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  return formattedTime.trim();
}
