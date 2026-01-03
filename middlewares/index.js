const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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

const verifyJWT = (req, res, next) => {
  let token = req.cookies.session; // from cookie

  if (token) {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // attach user data
    next();
  } else token = null;

  next();
};

module.exports = [
  httpsRedirect,
  cors(),
  morgan("tiny"),
  cookieParser(),
  express.json(),
  express.urlencoded({ extended: true }),
  verifyJWT,
];
