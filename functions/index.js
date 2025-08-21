const path = require("path");
const { Storage } = require("@google-cloud/storage");
const git = require("./git");

const { domains } = require("../data");
console.log(domains);

function getSubname(domain) {
  return Object.keys(domains).filter((key) => domains[key].includes(domain))[0];
}

const bucket = new Storage().bucket("supercpanel");

function getFile(subname, reqPath) {
  let cleaned = decodeURIComponent(reqPath);

  // If path appears to be a file (has extension), use it; else fallback to index.html
  const hasExt = path.extname(cleaned) !== "";
  const filePath = hasExt ? cleaned : path.join("index.html");

  console.log(subname, reqPath);
  return bucket.file(
    path.join("u", "unknown", "default", "dist", subname, filePath)
  );
}

module.exports = { getSubname, getFile, ...git };
