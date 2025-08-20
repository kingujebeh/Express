const path = require("path");
const { Storage } = require("@google-cloud/storage");
const { domains } = require("../data");
console.log(domains);

function getSubname(domain) {
  return Object.keys(domains).filter((key) => domains[key].includes(domain));
}

const bucket = new Storage().bucket("supercpanel");

function getFile(projectID, subname, reqPath) {
  filePath = decodeURIComponent(reqPath);

  // organize by first letter to shard if desired
  const prefix = projectID[0];

  // If path appears to be a file (has extension), use it; else fallback to index.html
  const hasExt = path.extname(cleaned) !== "";
  const filePath = hasExt ? cleaned : path.join("index.html");

  console.log(prefix, projectID, subname, "dist", filePath);
  return bucket.file(path.join(prefix, projectID, subname, "dist", filePath));
}

module.exports = { getSubname, getFile };
