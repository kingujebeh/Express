const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

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

module.exports = [
  httpsRedirect,
  cors(),
  morgan("common"),
  express.json(),
  express.urlencoded({ extended: true }),
];
