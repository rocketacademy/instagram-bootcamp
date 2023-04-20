const formatHour = (hour) => {
  if (hour > 12) {
    return hour - 12;
  } else if (hour === 0) {
    return 12;
  } else {
    return hour;
  }
};

const formatMinute = (minute) => {
  return minute < 10 ? `0${minute}` : minute;
};

const formatDay = (day) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
};

export { formatHour, formatMinute, formatDay };
