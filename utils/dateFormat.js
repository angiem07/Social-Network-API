// Function to add suffix to the date (e.g., 1st, 2nd, 3rd, 4th)
const addDateSuffix = date => {
  let dateStr = date.toString();

  const lastChar = dateStr.charAt(dateStr.length - 1);

  if (lastChar === '1' && dateStr !== '11') {
    dateStr += 'st';
  } else if (lastChar === '2' && dateStr !== '12') {
    dateStr += 'nd';
  } else if (lastChar === '3' && dateStr !== '13') {
    dateStr += 'rd';
  } else {
    dateStr += 'th';
  }

  return dateStr;
};

// Function to format a timestamp
module.exports = (timestamp, { monthLength = 'short', dateSuffix = true } = {}) => {
  // Define month names
  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dateObj = new Date(timestamp);

  // Validate timestamp
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid timestamp');
  }

  // Select month length based on option
  const months = monthLength === 'short' ? monthsShort : monthsLong;

  const formattedMonth = months[dateObj.getMonth()];

  const dayOfMonth = dateSuffix ? addDateSuffix(dateObj.getDate()) : dateObj.getDate();

  const year = dateObj.getFullYear();

  let hour = dateObj.getHours();
  // Convert 24-hour time to 12-hour time
  let periodOfDay = 'am';
  if (hour >= 12) {
    periodOfDay = 'pm';
    if (hour > 12) {
      hour -= 12;
    }
  }
  // Adjust hour for midnight
  if (hour === 0) {
    hour = 12;
  }

  const minutes = (dateObj.getMinutes() < 10 ? '0' : '') + dateObj.getMinutes();

  const formattedTimeStamp = `${formattedMonth} ${dayOfMonth}, ${year} at ${hour}:${minutes} ${periodOfDay}`;

  return formattedTimeStamp;
};
