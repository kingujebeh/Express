const path = require("path");
const { Storage } = require("@google-cloud/storage");

const auth = require("./auth");
const { domains } = require("../data");

console.log(domains);

function getSubname(domain) {
  return Object.keys(domains).filter((key) => domains[key].includes(domain))[0];
}

const bucket = new Storage().bucket("great-unknown.appspot.com");

async function getFile(subname, reqPath) {
  let cleaned = decodeURIComponent(reqPath);

  // If path appears to be a file (has extension), use it; else fallback to index.html
  const hasExt = path.extname(cleaned) !== "";
  const filePath = hasExt ? cleaned : path.join("index.html");

  return await bucket.file(path.join("client", "dist", subname, filePath));
}

module.exports = { getSubname, getFile, ...auth };
