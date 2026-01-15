const crypto = require("crypto");

function generateUID() {
  return crypto.randomUUID({ version: 7 }).replace(/-/g, "");
}

module.exports = {
  generateUID,
};
