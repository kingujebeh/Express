const path = require("path");
const mime = require("mime-types");
const fn = require("../functions");

const { real } = require("../data");

const subdomains = ["i", "handyman", "handyfix", "fairpay"];

const auth = require("./auth");

const home = async (req, res) => {
  const subname =
    req.subdomains.find((s) => subdomains.includes(s)) ||
    fn.getSubname(req.headers.host);

  let reqPath = req.path || "/";
  const hasExt = path.extname(reqPath) !== "";

  // Service Worker / assets should serve real files
  const filePath = hasExt ? reqPath : "/index.html";

  const file = fn.getFile(subname, filePath);
  const [exists] = await file.exists();

  if (!exists) {
    return res.status(404).send(hasExt ? "Not found" : "App not found");
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

  res.type(contentType).send(buffer);
};

const data = async (req, res) => {
  res.json(real);
};

module.exports = { home, data, auth };
