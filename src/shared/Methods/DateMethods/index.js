/**
 * Get the week of the selected date;
 * @param {Date} _date
 */
import moment from 'moment';
export const getWeekNumber = _date => {
  // Copy date so don't modify original
  _date = new Date(
    Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate()),
  );
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  _date.setUTCDate(_date.getUTCDate() + 4 - (_date.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(_date.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((_date - yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return weekNo;
};

/**
 * Get the time in Date and return time in format HH:MM
 * @param {Date} dateValue
 */

export const getTime = dateValue => {
  if (!dateValue) {
    return '';
  }

  let hours = dateValue.getHours();
  let minutes = dateValue.getMinutes();

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  const strTime = hours + ':' + minutes;

  return strTime;
};

/**
 * Compare two times
 * @param {string} start_time format HH:MM
 * @param {string} end_time format HH:MM
 */

export const compareTime = (start_time, end_time) => {
  let new_start_date = new Date();
  new_start_date.setHours(
    start_time.split(':')[0],
    start_time.split(':')[1],
    0,
    0,
  );

  let new_end_date = new Date();
  new_end_date.setHours(end_time.split(':')[0], end_time.split(':')[1], 0, 0);

  return end_time < start_time;
};

export const validateTime = (
  isRequired,
  start_date,
  end_date,
  start_time,
  end_time
) => {
  let isValid = false;

  if (
    (!start_date && !end_date) ||
    (!start_date && end_date) ||
    (start_date && !end_date)
  ) {
    return true;
  }

  if (!validateDate(true, start_date, end_date)) {
    return true;
  }

  if (start_date && end_date && start_time && end_time) {
    const initialDate = moment(`${start_date}T${start_time}`);
    const finalDate = moment(`${end_date}T${end_time}`);
    if (moment(initialDate).isBefore(finalDate)) {
      isValid = true;
    }
  }

  if (!start_time && !end_time && !isRequired) {
    isValid = true;
  }

  return isValid;
};

export const dateIsoFormat = (date, time) => {
  const hour = getTime(time);
  const new_date = new Date(date);
  new_date.setHours(hour.split(':')[0], hour.split(':')[1], 0, 0);

  return  moment(new_date).format('YYYY-MM-DD HH:mm:ss');
};

export const dateTimeFormat = (date, time) => {
  console.log('date', date);
  const hour = getTime(time);
  console.log('time', time);
  const new_date = new Date(date);
  console.log('new_date', new_date);
  new_date.setHours(hour.split(':')[0], hour.split(':')[1], 0, 0);

  return  moment(new_date).format('YYYY-MM-DD HH:mm:ss');
};

export const timeTextFormat = dateValue => {
  if (!dateValue) {
    return '';
  }

  let hours = dateValue.getHours();
  let minutes = dateValue.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;

  return strTime;
};

/**
 * Reset the time in dates and review if the start date
 * is equal to end date
 * @param {Date} start_date
 * @param {Date} end_date
 */
export const compareDate = (start_date, end_date, type) => {
  let result = true;

  console.log('start_date', start_date);
  console.log('end_date', end_date);

  const new_start_date = new Date(start_date);
  new_start_date.setHours(0, 0, 0, 0);

  const new_end_date = new Date(end_date);
  new_end_date.setHours(0, 0, 0, 0);

  


  switch (type) {
    case '>':
      result = new_start_date.getTime() > new_end_date.getTime();
      break;
    case '<':
      result = new_start_date.getTime() < new_end_date.getTime();
      break;
    case '<=':
      result = new_start_date.getTime() <= new_end_date.getTime();
      break;
    case '>=':
      result = new_start_date.getTime() >= new_end_date.getTime();
      break;
    default:
      result = new_start_date.getTime() === new_end_date.getTime();
      break;
  }

  return result;
};

export const compareTimeDate = (start, end, type) => {
  let result = false;
  const new_start = getTime(start);
  const new_end = getTime(end);
  const aux_start_date = new Date();
  const aux_end_date = new Date();

  aux_start_date.setHours(
    new_start.split(':')[0],
    new_start.split(':')[1],
    0,
    0,
  );

  aux_end_date.setHours(new_end.split(':')[0], new_end.split(':')[1], 0, 0);

  switch (type) {
    case '>':
      result = aux_start_date.getTime() > aux_end_date.getTime();
      break;
    case '<':
      result = aux_start_date.getTime() < aux_end_date.getTime();
      break;
    default:
      result = aux_start_date.getTime() === aux_end_date.getTime();
      break;
  }

  return result;
};

/**
 * return the string date (2021-01-26) from date format
 * @param {Date} date_value //Date lte gmt
 */
export const dateToStringDate = date_value => {
  return `${date_value.getFullYear()}-${
    date_value.getMonth() + 1 <= 9 ? '0' : ''
  }${date_value.getMonth() + 1}-${
    date_value.getDate() <= 9 ? '0' : ''
  }${date_value.getDate()}`;
};
