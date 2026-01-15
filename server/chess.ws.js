import { WebSocketServer } from "ws";

export default function initChessWS(server) {
    const wss = new WebSocketServer({ noServer: true });

    server.on("upgrade", (req, socket, head) => {
        if (req.url === "/chess") {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit("connection", ws, req);
            });
        }
    });

    wss.on("connection", (ws) => {
        console.log("♟️ Chess client connected");

        ws.on("message", (data) => {
            console.log("Chess message:", data.toString());
            // chess game logic
        });

        ws.on("close", () => {
            console.log("♟️ Chess client disconnected");
        });
    });

    return wss;
}
