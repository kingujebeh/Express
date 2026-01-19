// /graphql/resolvers/account.resolver.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v7 as uuidv7 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

// Helper to generate access + refresh tokens
async function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = uuidv7().replace(/-/g, ""); // long random token
  return { accessToken, refreshToken };
}

export const accountResolver = {
  Mutation: {
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

    signin: async (_, { input }, { db }) => {
      const { identifier, password } = input;

      try {
        // 1️⃣ Find user
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

        // 4️⃣ Save refresh token in DB
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

    refreshToken: async (_, { token }, { db }) => {
      try {
        // 1️⃣ Find user with this refresh token
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
        const { accessToken, refreshToken: newRefreshToken } =
          await generateTokens(user._id);

        // 3️⃣ Update refresh token in DB
        await db.main
          .collection("accounts")
          .updateOne(
            { _id: user._id },
            { $set: { refreshToken: newRefreshToken } }
          );

        return {
          token: accessToken,
          refreshToken: newRefreshToken,
          user: { id: user._id, username: user.username, email: user.email },
          error: null,
        };
      } catch (err) {
        console.error("RefreshToken resolver error:", err);
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
