// /graphql/resolvers/account.resolver.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export const accountResolver = {
  Mutation: {
    signup: async (_, { input }, context) => {
      const { username, email, password } = input;
      console.log(context);

      // 1. Check if user exists in main.users
      const existing = await db.main.collection("users").findOne({
        $or: [{ email }, { username }],
      });
      if (existing) {
        throw new Error("User already exists");
      }

      // 2. Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Generate a UUID without dashes for _id
      const userId = uuidv4().replace(/-/g, "");

      // 4. Insert user into main.users
      const userRecord = {
        _id: userId,
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      };
      await db.main.collection("users").insertOne(userRecord);

      // 5. Auto sign in: generate JWT
      const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });

      return {
        token,
        user: {
          id: userId,
          username,
          email,
        },
      };
    },

    signin: async (_, { input }, { db }) => {
      const { identifier, password } = input;

      // 1. Find user by email or username in main.users
      const user = await db.main.collection("users").findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // 2. Check password
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Invalid credentials");
      }

      // 3. Generate JWT
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "30d",
      });

      return {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      };
    },
  },
};
