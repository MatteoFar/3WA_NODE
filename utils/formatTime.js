const dayjs = require("dayjs");

exports.FormatTime = function (date) {
  return dayjs(date).format("DD/MM/YYYY");
};
