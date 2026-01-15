// middlewares/index.js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

export const httpsRedirect = (req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
};

export const verifyJWT = (req, res, next) => {
  const token = req.cookies?.session; // optional chaining in case cookies is undefined

  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET); // attach user data
    } catch (err) {
      console.error("JWT verification failed:", err);
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};

// Array of middlewares to use globally
const middlewares = [
  httpsRedirect,
  cors(),
  morgan("tiny"),
  cookieParser(),
  express.json(),
  express.urlencoded({ extended: true }),
  verifyJWT,
];

export default middlewares;
