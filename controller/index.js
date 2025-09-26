const path = require("path");
const mime = require("mime-types");
const fn = require("../functions");

const { real } = require("../data");
const subdomains = ["i", "handyman", "handyfix", "fairpay"];
const auth = require("./auth");

const home = async (req, res) => {
  try {
    const subname =
      req.subdomains.find((s) => subdomains.includes(s)) ||
      fn.getSubname(req.headers.host);

    const reqPath = req.path || "/";
    const hasExt = path.extname(reqPath) !== "";

    let filePath;

    if (hasExt) {
      // request for static asset (e.g., .js, .css, .png)
      filePath = reqPath.substring(1);
    } else {
      // SPA route → always fallback to index.html
      filePath = "index.html";
    }

    let targetSub = subname;

    // force SPA subdomains to use krane
    if (!hasExt) {
      targetSub = "krane";
    }

    let file = fn.getFile(targetSub, filePath);
    let [exists] = await file.exists();

    // if asset doesn’t exist but it was a static file, 404
    if (!exists && hasExt) {
      return res.status(404).send("Not found");
    }

    // if SPA index.html doesn’t exist in krane, fallback to default
    if (!exists && !hasExt) {
      file = fn.getFile("default", "index.html");
      [exists] = await file.exists();

      if (!exists) {
        return res.status(404).send("App not found");
      }
    }

    const [buffer] = await file.download();
    const contentType = mime.lookup(file.name) || "application/octet-stream";

    // headers
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
