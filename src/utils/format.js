const formatDate = (date) =>
  date.toLocaleString(`en-GB`, {
    day: `numeric`,
    month: `long`
  });

const formatTime = (date) =>
  date.toLocaleString(`en-US`, {
    hour12: true,
    hour: `numeric`,
    minute: `numeric`
  });

export {
  formatDate,
  formatTime,
};
