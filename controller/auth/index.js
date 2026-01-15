const axios = require("axios");
const fn = require("@/functions");

const signup = async (req, res) => {
  const { email, password, username } = req.body;

  const url = `https://${process.env.ORACLE}/api/account/create`;

  console.log(url);
  await axios.post(url, {
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
