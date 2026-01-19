import jwt from "jsonwebtoken";

export const context = ({ req }) => {
  const db = getDatabases();

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return {};

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { db, uid: decoded.userId };
  } catch {
    return {};
  }
};
