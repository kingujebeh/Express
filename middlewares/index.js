const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { domains } = require("../data");

let domainslist = [];

for (let [key, list] of Object.entries(domains)) {
  domainslist.push(...list);
}

const httpsRedirect = (req, res, next) => {
  if (!domainslist.includes(req.headers.host)) {
    console.warn(`Blocked request from host: ${req.headers.host}`);
    return res.status(403).send("Forbidden");
  }

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
