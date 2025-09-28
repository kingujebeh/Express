const express = require("express");
const core = require("./core");
const middlewares = require("./middlewares");
const router = require("./router");
const { home } = require("./controller");

const app = express();

app.set("trust proxy", true);

// Global middlewares
app.use(middlewares);

// API routes first
app.use("/api", router);

app.use(async (req, res, next) => {
  try {
    await home(req, res);
  } catch (err) {
    next(err);
  }
});

const PORT = process.env.PORT || 3000;

(async () => {
  await core.init();
  app.listen(PORT, () => {
    console.log("Unknown Server Running on port", PORT);
  });
})();
