require("module-alias/register");

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

// SPA fallback — catch all remaining routes
app.use((req, res, next) => {
  home(req, res, next);
});

const PORT = process.env.PORT || 3000;

(async () => {
  await core.init();
  app.listen(PORT, () => {
    console.log("Unknown Server Running on port", PORT);
  });
})();
