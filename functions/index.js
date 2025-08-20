const path = require("path");
const { Storage } = require("@google-cloud/storage");
const { domains } = require("../data");
console.log(domains);

function getSubname(domain) {
  return Object.keys(domains).filter((key) => domains[key].includes(domain));
}

const bucket = new Storage().bucket("supercpanel");

function getFile(projectID, subname, filePath) {

  

  // organize by first letter to shard if desired
  const prefix = projectID[0];
  return bucket.file(path.join(prefix, projectID, subname, "dist", filePath));
}

module.exports = { getSubname, getFile };
