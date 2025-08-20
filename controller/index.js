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

  // Detect index.html to inject app type
  if (filePath.endsWith("index.html")) {
    let html = buffer.toString("utf8");

    // Example: inject <script> with global var before </head>
    html = html.replace(
      "</head>",
      `<script>window.APP_TYPE=${JSON.stringify(fn.getSubname(req.headers.host))};</script></head>`
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
