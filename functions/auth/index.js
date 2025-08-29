const { getSecret } = require("../../secrets");
const db = require("../../db");

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

const getnerateJWT = (payload) =>
  jwt.sign(
    {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    },
    getSecret(JWT_SECRET),
    { expiresIn: "7d" } // token expires in 7 days
  );

module.exports = { getUser, signup, getnerateJWT };
