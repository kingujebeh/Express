import { WebSocketServer } from "ws";

export default function createBabyClaraWSS() {
  const wss = new WebSocketServer({ noServer: true });

  // Server upgrade handled centrally

  wss.on("connection", (ws, req) => {
    console.log("🍼 BabyClara client connected");

    ws.on("message", (data) => {
      console.log("BabyClara message:", data.toString());
      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          // 1 = OPEN
          client.send(data);
        }
      });
    });

    ws.on("close", () => {
      console.log("🍼 BabyClara client disconnected");
    });
  });

  return wss;
}
