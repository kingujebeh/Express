const path = require("path");
const mime = require("mime-types");
const fn = require("../functions");

const { real } = require("../data");

const subdomains = ["i", "handyman", "handyfix", "fairpay"];
const auth = require("./auth");

const home = async (req, res, next) => {
  try {
    const subname =
      req.subdomains.find((s) => subdomains.includes(s)) ||
      fn.getSubname(req.headers.host) ||
      "krane";

    const reqPath = req.path || "/";
    const hasExt = path.extname(reqPath) !== "";

    // resolve path
    const filePath = hasExt ? reqPath.replace(/^\//, "") : "index.html";

    const file = await fn.getFile(subname, filePath);
    const [exists] = await file.exists();

    // if requested static file doesn’t exist → 404
    if (!exists && hasExt) {
      return res.status(404).send("Not found");
    }

    // if SPA route but file doesn’t exist → fallback to krane/index.html
    let targetFile = file;
    if (!exists && !hasExt) {
      targetFile = fn.getFile("krane", "index.html");
    }

    const [buffer] = await targetFile.download();
    const contentType =
      mime.lookup(targetFile.name) || "application/octet-stream";

    console.log("Serving:", targetFile.name);

    if (contentType === "text/html") {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    } else {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }

    // ✅ return to stop further execution
    return res.type(contentType).send(buffer);
  } catch (err) {
    console.error("Error in home handler:", err);
    return next(err);
  }
};

const data = async (req, res) => {
  res.json(real);
};

module.exports = { home, data, auth };
