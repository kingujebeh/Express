// /graphql/context.js
import { getDatabases } from "../service/db.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export const context = ({ req }) => {
  // 1️⃣ Always get the databases
  const db = getDatabases();

  // 2️⃣ Check for JWT token in Authorization header
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  let uid = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      uid = decoded.userId;
    } catch (err) {
      console.warn("⚠️ Invalid JWT token", err.message);
    }
  }

  // 3️⃣ Return db and uid for all resolvers
  return { db, uid };
};
