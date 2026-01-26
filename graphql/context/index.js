// /graphql/context.js
// import { getDatabases } from "../service/db.js";
import jwt from "jsonwebtoken";

export const context = async ({ req }) => {
  // 1. Connect to your databases
  const db = await getDatabases(); // main, products, institutions, web

  // 2. Extract token from headers
  const token = req.headers.authorization?.replace("Bearer ", "");

  // 3. Decode token if it exists
  let id;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      id = decoded.userId;
    } catch (err) {
      console.warn("⚠️ Invalid JWT token:", err.message);
    }
  }

  // 4. Return context object
  return { db, id };
};
