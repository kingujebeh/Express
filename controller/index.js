const mime = require("mime-types");
const fn = require("../functions");

const home = async (req, res) => {
  console.log(req.headers.host);
  const subname = fn.getSubname(req.headers.host);
  const filePath = req.path;

  console.info(req.headers.host, subname);
  const file = fn.getFile("unknown", "default", filePath);
  const [exists] = await file.exists();
  if (!exists) return res.status(404).send("App not found");

  const contentType = mime.lookup(file.name) || "application/octet-stream";

  const [buffer] = await file.download();

  let output = buffer;

  let normalizedPath = filePath;
  if (normalizedPath === "/" || normalizedPath === "") {
    normalizedPath = "/index.html";
  }

  if (normalizedPath.endsWith("index.html")) {
    let html = buffer.toString("utf8");
    html = html.replace(
      "</head>",
      `<script>window.APP_TYPE=${JSON.stringify(subname)};</script></head>`
    );
    output = Buffer.from(html, "utf8");
  }

  if (/\.(html|js|css)$/.test(filePath)) {
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
