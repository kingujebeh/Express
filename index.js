// index.js
import express from "express";

import {init} from "./core/index.js";
import middlewares from "./middlewares/index.js";
import router from "./router/index.js";
import { home } from "./controller/index.js";

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
  await init();
  app.listen(PORT, () => {
    console.log("Unknown Server Running on port", PORT);
  });
})();
