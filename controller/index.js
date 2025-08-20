const fn = require("../functions");

const home = async (req, res) => {
  const subname = fn.getSubname(req.headers.host);
  const filePath = req.path;

  console.info(req.headers.host, subname);
  const file = fn.getFile("unknown", subname, filePath);
  const [exists] = await file.exists();
  if (!exists) return res.status(404).send("App not found");

  const contentType = mime.lookup(file.name) || "application/octet-stream";

  const [buffer] = await file.download();

  if (/\.(html|js|css)$/.test(filePath)) {
    // No caching for HTML, JS, CSS
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  } else {
    // Optional: long-term cache for other static assets like images
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }

  res.type(contentType).send(buffer);
};

module.exports = { home };
