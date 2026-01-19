// /graphql/resolvers/account.resolver.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v7 as uuidv7 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

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

        // 5️⃣ Generate JWT
        const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });

        return {
          token,
          user: { id, username, email },
          error: null,
        };
      } catch (err) {
        console.error("Signup resolver error:", err);
        return {
          token: null,
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
            user: null,
            error: {
              code: "INVALID_CREDENTIALS",
              message: "Invalid credentials",
            },
          };
        }

        // 3️⃣ Generate JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
          expiresIn: "30d",
        });

        return {
          token,
          user: { id: user._id, username: user.username, email: user.email },
          error: null,
        };
      } catch (err) {
        console.error("Signin resolver error:", err);
        return {
          token: null,
          user: null,
          error: { code: "SIGNIN_FAILED", message: err.message },
        };
      }
    },
  },
};
