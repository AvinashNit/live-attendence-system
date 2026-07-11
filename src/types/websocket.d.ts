import { WebSocket } from "ws";

interface AuthenticatedWebSocket extends WebSocket {
    user: {
        id: string;
        role: string;
    };
}