const signup = (req, res) => {
  const { email, password, username } = req.body;

  res.json({ email, username });
};

const signin = (req, res) => {
  const { email, password } = req.body;

  res.json({ email });
};

module.exports = { signup , signin};
