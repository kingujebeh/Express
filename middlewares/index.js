// middlewares/index.js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const httpsRedirect = (req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
};

// Array of middlewares to use globally
const middlewares = [
  httpsRedirect,
  cors({
    origin: true,
    credentials: true,
  }),
  morgan("tiny"),
  cookieParser(),
];

export default middlewares;
