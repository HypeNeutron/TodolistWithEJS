function getDate() {
  const today = new Date();
  const opts = { weekday: "long", day: "numeric", month: "long" };
  return "Today " + today.toLocaleDateString("en-US", opts);
}

function getDay() {
  const today = new Date();
  const opts = { weekday: "long" };
  return today.toLocaleDateString("en-US", opts);
}

module.exports = { getDate, getDay };
