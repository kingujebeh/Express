// index.js
import express from "express";
import http from "http";

import { init } from "./core/index.js";
import middlewares from "./middlewares/index.js";
import router from "./router/index.js";
import { home } from "./controller/index.js";

// WS servers
import initBabyClaraWS from "./server/babyclara.ws.js";
import initChessWS from "./server/chess.ws.js";
import initLudoWS from "./server/ludo.ws.js";

const app = express();
app.set("trust proxy", true);

// Global middlewares
app.use(middlewares);

// API routes
app.use("/api", router);

// SPA fallback
app.use((req, res, next) => {
  home(req, res, next);
});

const PORT = process.env.PORT || 3000;

(async () => {
  await init();

  const server = http.createServer(app);

  // Attach WebSocket servers
  initBabyClaraWS(server);
  initChessWS(server);
  initLudoWS(server);

  server.listen(PORT, () => {
    console.log("Unknown Server Running on port", PORT);
  });
})();
