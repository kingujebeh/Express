// index.js
import "dotenv/config";

import http from "http";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";

import middlewares from "./middlewares/index.js";
import { home } from "./controller/index.js";

// WS servers
import createBabyClaraWSS from "./server/babyclara.ws.js";
import createChessWSS from "./server/chess.ws.js";
import createLudoWSS from "./server/ludo.ws.js";
import jwt from "jsonwebtoken";

// GraphQL
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/schema/index.js";
import { resolvers } from "./graphql/resolver/index.js";
import { context } from "./graphql/context/index.js"; // ✅ your existing context
// import { connectDatabases } from "./graphql/service/db.js";

// -----------------------------
// Connect to databases
// -----------------------------
// await connectDatabases(); // { main, products, institutions, web }

// -----------------------------
// Express setup
// -----------------------------
const app = express();
app.set("trust proxy", true);
app.use(middlewares);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------
// Apollo GraphQL Server
// -----------------------------
const apollo = new ApolloServer({ typeDefs, resolvers });
await apollo.start();

// Pass context correctly here
app.use(
  "/graphql",
  express.json(),
  expressMiddleware(apollo, {
    context,
  })
);

app.use((req, res, next) => home(req, res, next));

// -----------------------------
// Start HTTP + WS Servers
// -----------------------------
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const babyClaraWss = createBabyClaraWSS();
const chessWss = createChessWSS();
const ludoWss = createLudoWSS();

server.on("upgrade", (req, socket, head) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get("token");

  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = user;
    } catch (err) {
      console.warn("Invalid WS token provided");
    }
  }

  if (url.pathname === "/babyclara") {
    babyClaraWss.handleUpgrade(req, socket, head, (ws) => {
      babyClaraWss.emit("connection", ws, req);
    });
  } else if (url.pathname === "/chess") {
    chessWss.handleUpgrade(req, socket, head, (ws) => {
      chessWss.emit("connection", ws, req);
    });
  } else if (url.pathname === "/ludo") {
    ludoWss.handleUpgrade(req, socket, head, (ws) => {
      ludoWss.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log("Unknown Server Running on port", PORT);
});
