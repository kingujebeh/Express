// /graphql/resolvers/account.resolver.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v7 as uuidv7 } from "uuid";

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, VITE_DEVELOPMENT_KEY } =
  process.env;

async function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
  return { accessToken, refreshToken };
}

export const accountResolver = {
  Query: {
    client: async (_, { username, key }, { host, db }) => {
      let client;

      if (username && key === process.env.VITE_DEVELOPMENT_KEY) {
        console.log("DEV MODE Client", username);

        client = await db.accounts.models.Client.findOne({ username });
      } else {
        console.log("PROD MODE Host", host);

        client = await db.accounts.models.Client.findOne({
          hosts: host,
        });
      }

      if (!client) {
        throw new Error("Client not found");
      }

      return {
        id: client._id,
        name: client.name,
        username: client.username,
        type: client.type,
      };
    },
  },
  Mutation: {
    /**
     * Create a new user account
     */
    signup: async (_, { input }, { db }) => {
      const { username, email, password } = input;

      try {
        // 1️⃣ Check if user exists
        const existing = await db.main.collection("accounts").findOne({
          $or: [{ email }, { username }],
        });

        if (existing) {
          return {
            token: null,
            refreshToken: null,
            user: null,
            error: { code: "USER_EXISTS", message: "User already exists" },
          };
        }

        // 2️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3️⃣ Generate UUID v7 without dashes
        const id = uuidv7().replace(/-/g, "");

        // 4️⃣ Insert user
        const userRecord = {
          _id: id,
          username,
          email,
          password: hashedPassword,
          refreshToken: null,
          createdAt: new Date(),
        };
        await db.main.collection("accounts").insertOne(userRecord);

        // 5️⃣ Generate tokens
        const { accessToken, refreshToken } = await generateTokens(id);

        // 6️⃣ Save refresh token in DB
        await db.main
          .collection("accounts")
          .updateOne({ _id: id }, { $set: { refreshToken } });

        return {
          token: accessToken,
          refreshToken,
          user: { id, username, email },
          error: null,
        };
      } catch (err) {
        console.error("Signup resolver error:", err);
        return {
          token: null,
          refreshToken: null,
          user: null,
          error: { code: "SIGNUP_FAILED", message: err.message },
        };
      }
    },

    /**
     * Sign in existing user
     */
    signin: async (_, { input }, { db }) => {
      const { identifier, password } = input;

      try {
        // 1️⃣ Find user by email or username
        const user = await db.main.collection("accounts").findOne({
          $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user) {
          return {
            token: null,
            refreshToken: null,
            user: null,
            error: {
              code: "INVALID_CREDENTIALS",
              message: "Invalid credentials",
            },
          };
        }

        // 2️⃣ Verify password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return {
            token: null,
            refreshToken: null,
            user: null,
            error: {
              code: "INVALID_CREDENTIALS",
              message: "Invalid credentials",
            },
          };
        }

        // 3️⃣ Generate tokens
        const { accessToken, refreshToken } = await generateTokens(user._id);

        // 4️⃣ Update refresh token in DB
        await db.main
          .collection("accounts")
          .updateOne({ _id: user._id }, { $set: { refreshToken } });

        return {
          token: accessToken,
          refreshToken,
          user: { id: user._id, username: user.username, email: user.email },
          error: null,
        };
      } catch (err) {
        console.error("Signin resolver error:", err);
        return {
          token: null,
          refreshToken: null,
          user: null,
          error: { code: "SIGNIN_FAILED", message: err.message },
        };
      }
    },

    /**
     * Refresh access token using refresh token
     */
    refreshToken: async (_, { token }, { db }) => {
      try {
        // 1️⃣ Find user by refresh token
        const user = await db.main
          .collection("accounts")
          .findOne({ refreshToken: token });

        if (!user) {
          return {
            token: null,
            refreshToken: null,
            user: null,
            error: {
              code: "INVALID_REFRESH",
              message: "Invalid refresh token",
            },
          };
        }

        // 2️⃣ Generate new tokens
        const { accessToken, refreshToken } = await generateTokens(user._id);

        // 3️⃣ Update refresh token in DB
        await db.main
          .collection("accounts")
          .updateOne({ _id: user._id }, { $set: { refreshToken } });

        return {
          token: accessToken,
          refreshToken,
          user: { id: user._id, username: user.username, email: user.email },
          error: null,
        };
      } catch (err) {
        console.error("Refresh token resolver error:", err);
        return {
          token: null,
          refreshToken: null,
          user: null,
          error: { code: "REFRESH_FAILED", message: err.message },
        };
      }
    },
  },
};
