const express = require("express");

const core = require("./core");

const middlewares = require("./middlewares");
const router = require("./router");
const { home } = require("./controller");

const app = express();

app.set("trust proxy", true);

app.use(middlewares);

app.use("/api", router);

// Catch All Exceptions
router.all("/{*any}", home);

const PORT = process.env.PORT || 3000;

(async () => {
  await core.init();
  app.listen(PORT, () => {
    console.log("Unknown Server Running", PORT);
  });
})();
