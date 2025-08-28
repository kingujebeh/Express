const { OAuth2Client } = require("google-auth-library");
const fn = require("../../functions");

const getUser = () => {};

const auth = async (req, res) => {
  const token = req.body.token;

  fn.signIn(token);
};

module.exports = auth;
