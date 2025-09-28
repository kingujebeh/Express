const path = require("path");
const mime = require("mime-types");
const fn = require("../functions");

const { real } = require("../data");

const subdomains = ["i", "handyman", "handyfix", "fairpay"];

const auth = require("./auth");

const home = async (req, res) => {
  async function sendFiles(subname) {
    const reqPath = req.path || "/";
    const hasExt = path.extname(reqPath) !== "";

    let filePath = hasExt ? reqPath : "/index.html";
    let file = await fn.getFile(subname, filePath);

    console.log("Requested file:", file.name);

    // const contentType = mime.lookup(file.name) || "application/octet-stream";
    const [buffer] = await file.download();

    // if (contentType === "text/html" || /\.html$/i.test(filePath)) {
    //   res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    //   res.setHeader("Pragma", "no-cache");
    //   res.setHeader("Expires", "0");
    // } else {
    //   res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    // }

    res
      // .type(contentType)
      .send(buffer);
  }

  const subname =
    req.subdomains.find((s) => subdomains.includes(s)) ||
    fn.getSubname(req.headers.host);

  await sendFiles(subname); // ✅ Only call once
};

const data = async (req, res) => {
  res.json(real);
};

module.exports = { home, data, auth };
