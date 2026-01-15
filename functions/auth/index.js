// functions/auth.js
import axios from "axios";
import jwt from "jsonwebtoken";

const oracle = process.env.ORACLE;

// Helper to get user from your database
 const getUser = async (sub) => await db.users.findOne({ googleId: sub });

// Helper to verify your app JWT
 const verifyJWT = (token) => jwt.verify(token, getSecret("JWT_SECRET"));

// Sign in using Google OAuth code
 const signin = async (code) => {
  try {
    // Exchange authorization code for tokens
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

    await registerAccountSignIn(user.uid);

    return { jwtToken, user };
  } catch (err) {
    console.error("Google signin error:", err);
    throw err;
  }
};

// Register the account signin with your Oracle API
async function registerAccountSignIn(userId, appName) {
  try {
    const { data } = await axios.put(
      `https://${oracle}/api/account/register/signin`,
      {
        appName,
        userId,
      }
    );

    console.log("Account Sign In Registered", data);
  } catch (error) {
    console.error("Failed to register account signin:", error?.response?.data || error);
  }
}

export {}