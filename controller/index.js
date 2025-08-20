const path = require("path");
const mime = require("mime-types");
const fn = require("../functions");

const home = async (req, res) => {
  const host = req.headers.host;
  const subname = fn.getSubname(host);

  const reqPath = req.path || "/";
  const hasExt = path.extname(reqPath) !== "";

  // If no extension, always serve index.html (SPA)
  let filePath = hasExt ? reqPath : "/index.html";

  let file = fn.getFile("unknown", "default", filePath);
  let [exists] = await file.exists();

  // If an asset was requested and doesn't exist, 404
  if (!exists && hasExt) {
    return res.status(404).send("Not found");
  }

  // If index.html fallback doesn't exist, app missing
  if (!exists && !hasExt) {
    return res.status(404).send("App not found");
  }

  const contentType = mime.lookup(file.name) || "application/octet-stream";
  const [buffer] = await file.download();
  let output = buffer;

  // Inject only when serving index.html
  if (filePath.endsWith("index.html")) {
    let html = buffer.toString("utf8");
    html = html.replace(
      /<\/head>/i,
      `<script>window.SOFTWARE=${JSON.stringify(subname)};</script></head>`
    );
    output = Buffer.from(html, "utf8");
  }

  // Cache: HTML no-cache; otherwise immutable long cache
  if (contentType === "text/html" || /\.html$/i.test(filePath)) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  } else {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }

  res.type(contentType).send(output);
};

const data = async (req, res) => {
  res.json({ data: "data" });
};

module.exports = { home, data };
