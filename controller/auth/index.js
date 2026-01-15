const signup = (req, res) => {
  const { email, password, username } = res.body;

  res.json({ email, username });
};

const signin = (req, res) => {
  const { email, password } = res.body;

  res.json({ email });
};

module.exports = { signup , signin};
