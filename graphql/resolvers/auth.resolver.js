import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "super-secret"; // use env var

export const authResolvers = {
  Mutation: {
    signup: async (_, { input }, { db }) => {
      const { username, email, password } = input;

      const existing = await db.users.findOne({
        $or: [{ email }, { username }],
      });

      if (existing) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await db.users.insertOne({
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      });

      const token = jwt.sign(
        { userId: user.insertedId },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return {
        token,
        user: {
          id: user.insertedId,
          username,
          email,
          createdAt: new Date(),
        },
      };
    },

    signin: async (_, { input }, { db }) => {
      const { identifier, password } = input;

      const user = await db.users.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return {
        token,
        user,
      };
    },
  },
};
