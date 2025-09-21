const axios = require("axios");

const { getSecret } = require("../../secrets");

const fn = require("../../functions");

const auth = async (req, res, next) => {
  const { code } = req.body;

  try {
    // Exchange code for tokens
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: getSecret("GOOGLE_CLIENT_ID"),
      client_secret: getSecret("GOOGLE_CLIENT_SECRET"),
      redirect_uri: "postmessage", // required for initCodeClient
      grant_type: "authorization_code",
    });

    const { id_token } = tokenRes.data;

    // Decode ID token (JWT) to get Google user info
    const googleUser = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString()
    );

    // Create your app JWT
    const jwtToken = jwt.sign(
      {
        sub: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      "JWT_SECRET",
      { expiresIn: "7d" }
    );

    res
      .cookie("session", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only over HTTPS
        sameSite: "lax", // or "strict"
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .send(googleUser);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = auth;
