const { OAuth2Client } = require("google-auth-library");
const { getSecret } = require("../../secrets");

const fn = require("../../functions");

const auth = async (req, res, next) => {
  const googleClientID = getSecret("GOOGLE_CLIENT_ID");
  const googleClientSecret = getSecret("GOOGLE_CLIENT_SECRET");
  const googleRedirectURI = getSecret("GOOGLE_REDIRECT_URI");

  const client = new OAuth2Client(googleClientID, googleClientSecret, googleRedirectURI );
  console.log(googleClientID, googleClientSecret, googleRedirectURI );

  const { code } = req.body;

  if (!code) next();

  let payload;

  try {
    const { token } = await client.getToken(code);

    console.log(token);

    // Verify Google ID token

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log(ticket);
    payload = ticket.getPayload();
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
    return;
  }

  console.log(payload);
  // Check if user exists in your DB
  // user = await fn.getUser(payload.sub);

  // if (!user) {
  //   // 🔹 This is "sign up"
  //   user = await fn.signup(payload);
  // }

  // const jwtToken = fn.getnerateJWT(payload);
  // const user = fn.verifyJWT(jwtToken);

  res
    // .cookie("session", jwtToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // only over HTTPS
    //   sameSite: "lax", // or "strict"
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // })
    .send(payload);
  // } catch (err) {
  //   res.status(401).send(err);
  // }
};

module.exports = auth;
