const fn = require("../../functions");

const auth = async (req, res, next) => {
  const { code } = req.body;

  try {
    const { jwtToken, user } = await fn.signin(code);

    res
      .cookie("session", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only over HTTPS
        sameSite: "lax", // or "strict"
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .send(user);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = auth;
