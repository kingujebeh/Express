const express = require("express");

const core = require("./core");

const middlewares = require("./middlewares");
const router = require("./router");
const { home } = require("./controller");

const app = express();

app.set("trust proxy", true);

app.use(middlewares);

app.use("/api", router);

app.get("/", (req, res, next) => {
  if (req.subdomains.includes("handy")) res.send("Hello World");
  else next()
});

// Catch All Exceptions
app.all("/{*any}", home);

const PORT = process.env.PORT || 3000;

(async () => {
  await core.init();
  app.listen(PORT, () => {
    console.log("Unknown Server Running", PORT);
  });
})();
