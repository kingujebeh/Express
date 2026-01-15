const axios = require("axios");
const fn = require("@/functions");

const signup = async (req, res) => {
  const { email, password, username } = req.body;

  await axios.post("https://unknown-oracle.onrender.com/api/account/create", {
    uid: fn.utility.generateUID(),
    username,
    email,
    password,
  });

  res.json({ email, username });
};

const signin = (req, res) => {
  const { email, password } = req.body;

  res.json({ email });
};

module.exports = { signup, signin };
