const path = require("path");
const mime = require("mime-types");
const fn = require("../functions");

const { real } = require("../data");

const subdomains = ["i", "handyman", "handyfix", "fairpay"];

const auth = require("./auth");

const home = async (req, res, next) => {
  async function sendFile(subname, filePath) {
    try {
      const file = await fn.getFile(subname, filePath);
      const contentType = mime.lookup(file.name) || "application/octet-stream";
      const [buffer] = await file.download();

      if (contentType === "text/html" || /\.html$/i.test(filePath)) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      } else {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }

      return res.type(contentType).send(buffer);
    } catch (err) {
      return null; // let caller decide fallback
    }
  }

  try {
    const subname =
      req.subdomains.find((s) => subdomains.includes(s)) ||
      fn.getSubname(req.headers.host);

    const reqPath = req.path || "/";
    const hasExt = path.extname(reqPath) !== "";

    // try requested path first if it's a file
    if (hasExt) {
      const sent = await sendFile(subname, reqPath);
      if (sent) return; // ✅ response finished
    }

    // fallback → index.html
    await sendFile(subname, "/index.html");
  } catch (err) {
    console.error("home error:", err);
    if (!res.headersSent) {
      res.status(500).send("Server error");
    } else {
      next(err);
    }
  }
};


const data = async (req, res) => {
  res.json(real);
};

module.exports = { home, data, auth };
