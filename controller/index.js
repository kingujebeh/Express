const data = require("../data");
console.log(data);

const home = (req, res) => {
  res.send("Opening " + req.headers.host);
};

module.exports = { home };
