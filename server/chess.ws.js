import { WebSocketServer } from "ws";

export default function createChessWSS() {
    const wss = new WebSocketServer({ noServer: true });

    // Server upgrade handled centrally

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
