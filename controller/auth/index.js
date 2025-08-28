const { OAuth2Client } = require("google-auth-library");
const fn = require("../../functions");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const auth = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    //   fn.signIn(token);

    res.send(user, payload);
  } catch (err) {
    res.status(401).send(err);
  }
};

module.exports = auth;
