import { WebSocketServer } from "ws";

export default function initBabyClaraWS(server) {
    const wss = new WebSocketServer({ noServer: true });

    server.on("upgrade", (req, socket, head) => {
        if (req.url === "/babyclara") {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit("connection", ws, req);
            });
        }
    });

    wss.on("connection", (ws, req) => {
        console.log("🍼 BabyClara client connected");

        ws.on("message", (data) => {
            console.log("BabyClara message:", data.toString());
            // handle BabyClara logic here
        });

        ws.on("close", () => {
            console.log("🍼 BabyClara client disconnected");
        });
    });

    return wss;
}
