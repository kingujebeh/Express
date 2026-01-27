// /graphql/context.js
import jwt from "jsonwebtoken";
import { accounts, products, institutions, stores } from "../../db/index.js";

export const context = async ({ req }) => {
  console.log("✅ Context created:");

  try {
    // 2️⃣ Extract token
    const token = req.headers.authorization?.replace("Bearer ", "");

    let id = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        id = decoded.userId;
      } catch (err) {
        console.warn("⚠️ Invalid JWT token:", err.message);
      }
    }

    return {
      host: req.hostname,
      db: { accounts, institutions, products, stores },
    };
  } catch (err) {
    console.error("🚨 GraphQL CONTEXT ERROR:", err);
    throw err; // This will propagate to Apollo and log a 500
  }
};
