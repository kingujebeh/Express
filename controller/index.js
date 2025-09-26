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

    if (hasExt) {
      // Serve static file (sw.js, main.js, CSS, images, etc.)
      const filePath = reqPath.substring(1); // remove leading slash
      const file = fn.getFile(subname, filePath);
      const [exists] = await file.exists();

      if (!exists) {
        return res.status(404).send("Not found");
      }

      const [buffer] = await file.download();
      const contentType = mime.lookup(file.name) || "application/octet-stream";

      // Cache assets long-term
      res.setHeader(
        "Cache-Control",
        contentType === "text/html"
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=31536000, immutable"
      );
      if (contentType === "text/html") {
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      }

      return res.type(contentType).send(buffer);
    }

    // SPA fallback: always serve index.html for non-extension routes
    const indexFile = fn.getFile(subname, "index.html");
    const [indexExists] = await indexFile.exists();

    if (!indexExists) {
      return res.status(404).send("App not found");
    }

    const [buffer] = await indexFile.download();

    // Disable caching for index.html
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.type("text/html").send(buffer);
  } catch (err) {
    console.error("Error in home handler:", err);
    res.status(500).send("Internal Server Error");
  }
};

const data = async (req, res) => {
  res.json(real);
};

module.exports = { home, data, auth };
