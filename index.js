const express = require("express");

const core = require("./core");

const middlewares = require("./middlewares");
const router = require("./router");

const app = express();

app.set("trust proxy", true);

app.use(middlewares);

app.use("/api", router);

const PORT = process.env.PORT || 3000;

(async () => {
  await core.init();
  app.listen(PORT, () => {
    console.log("Unknown Server Running", PORT);
  });
})();
