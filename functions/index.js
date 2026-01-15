const path = require("path");
const { Storage } = require("@google-cloud/storage");

const auth = require("./auth");
const utility = require("./utility");

const { domains } = require("../data");

function getSubname(domain) {
  return Object.keys(domains).find((key) => domains[key].includes(domain));
}

const storage = new Storage({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
  projectId: "great-unknown",
});

const bucket = storage.bucket("great-unknown.appspot.com");

function sanitizePath(p) {
  return p
    .split("?")[0] // remove query string
    .replace(/^\/+/, "") // remove leading slashes
    .replace(/\.\./g, ""); // prevent directory traversal
}

function getFile(subname = "krane", reqPath = "/") {
  const cleaned = sanitizePath(decodeURIComponent(reqPath));

  const hasExt = path.extname(cleaned) !== "";
  const filePath = hasExt ? cleaned : "index.html";

  return bucket.file(path.join("client", "dist", subname, filePath));
}



module.exports = { getSubname, getFile, auth, utility };
