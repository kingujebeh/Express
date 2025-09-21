const axios = require("axios");
const jwt = require("jsonwebtoken");

const db = require("../../db");

const { getSecret } = require("../../secrets");

const signup = async () => {
  user = await db.users.insert({
    googleId: sub,
    email,
    name,
    picture,
    createdAt: new Date(),
  });
  let user = await db.users.findOne({ googleId: sub });
};

const getUser = async (sub) => await db.users.findOne({ googleId: sub });

const verifyJWT = (token) => jwt.verify(token, getSecret("JWT_SECRET"));

const signin = async () => {
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

    const user = {
      uid: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
    };

    // Create your app JWT
    const jwtToken = jwt.sign(user, getSecret("JWT_SECRET"), {
      expiresIn: "30d",
    });

    return { jwtToken, user };
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getUser, signin, signup, verifyJWT };
