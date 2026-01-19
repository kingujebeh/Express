// /graphql/resolvers/account.resolver.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v7 as uuidv7 } from "uuid";
import { GraphQLError } from "graphql";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

function mapError(message, code) {
  return new GraphQLError(message, {
    extensions: { code },
  });
}

export const accountResolver = {
  Mutation: {
    signup: async (_, { input }, { db }) => {
      try {
        const { username, email, password } = input;

        // 1️⃣ Check if user exists
        const existing = await db.main.collection("accounts").findOne({
          $or: [{ email }, { username }],
        });
        if (existing) {
          return {
            error: mapError("User already exists", "USER_EXISTS"),
          };
        }

        // 2️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3️⃣ Generate UUID v7 without dashes
        const uid = uuidv7().replace(/-/g, "");

        // 4️⃣ Insert user
        const userRecord = {
          _id: uid,
          username,
          email,
          password: hashedPassword,
          createdAt: new Date(),
        };
        await db.main.collection("accounts").insertOne(userRecord);

        // 5️⃣ Generate JWT
        const token = jwt.sign({ uid }, JWT_SECRET, { expiresIn: "30d" });

        return {
          token,
          user: {
            id: uid,
            username,
            email,
          },
        };
      } catch (err) {
        console.error("Signup failed:", err);
        return {
          error: mapError("Internal server error", "SIGNUP_FAILED"),
        };
      }
    },

    signin: async (_, { input }, { db }) => {
      try {
        const { identifier, password } = input;

        // 1️⃣ Find user
        const user = await db.main.collection("accounts").findOne({
          $or: [{ email: identifier }, { username: identifier }],
        });
        if (!user) {
          return {
            error: mapError("Invalid credentials", "INVALID_CREDENTIALS"),
          };
        }

        // 2️⃣ Check password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return {
            error: mapError("Invalid credentials", "INVALID_CREDENTIALS"),
          };
        }

        // 3️⃣ Generate JWT
        const token = jwt.sign({ uid: user._id }, JWT_SECRET, {
          expiresIn: "30d",
        });

        return {
          token,
          user: {
            uid: user._id,
            username: user.username,
            email: user.email,
          },
        };
      } catch (err) {
        console.error("Signin failed:", err);
        return {
          error: mapError("Internal server error", "SIGNIN_FAILED"),
        };
      }
    },
  },
};
