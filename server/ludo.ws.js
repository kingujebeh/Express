import { WebSocketServer } from "ws";

export default function createLudoWSS() {
    const wss = new WebSocketServer({ noServer: true });

    // Server upgrade handled centrally

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
