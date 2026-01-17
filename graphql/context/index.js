import jwt from "jsonwebtoken";

export const context = ({ req }) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return {};

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decoded.userId };
  } catch {
    return {};
  }
};
