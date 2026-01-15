import { WebSocketServer } from "ws";

export default function initLudoWS(server) {
    const wss = new WebSocketServer({ noServer: true });

    server.on("upgrade", (req, socket, head) => {
        if (req.url === "/ludo") {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit("connection", ws, req);
            });
        }
    });

    wss.on("connection", (ws) => {
        console.log("🎲 Ludo client connected");

        ws.on("message", (data) => {
            console.log("Ludo message:", data.toString());
            // ludo game logic
        });

        ws.on("close", () => {
            console.log("🎲 Ludo client disconnected");
        });
    });

    return wss;
}
