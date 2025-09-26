const path = require("path");
const mime = require("mime-types");
const fn = require("../functions");

const { real } = require("../data");

const subdomains = ["i", "handyman", "handyfix", "fairpay"];
const auth = require("./auth");

const home = async (req, res) => {
  try {
    // pick subdomain if valid, else krane
    const subname =
      req.subdomains.find((s) => subdomains.includes(s)) ||
      fn.getSubname(req.headers.host) ||
      "krane";

    const reqPath = req.path || "/";
    const hasExt = path.extname(reqPath) !== "";

    let file;
    if (hasExt) {
      // request for static asset → from actual subdomain bucket
      const filePath = reqPath.substring(1);
      file = fn.getFile(subname, filePath);

      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).send("Not found");
      }
    } else {
      // SPA route → always fallback to krane/index.html
      file = fn.getFile("krane", "index.html");

      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).send("App not found");
      }
    }

    const [buffer] = await file.download();
    const contentType = mime.lookup(file.name) || "application/octet-stream";

    if (contentType === "text/html") {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    } else {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }

    return res.type(contentType).send(buffer);
  } catch (err) {
    console.error("Error in home handler:", err);
    res.status(500).send("Internal Server Error");
  }
};

const data = async (req, res) => {
  res.json(real);
};

module.exports = { home, data, auth };
