// socketService.ts
import io from "socket.io-client";

let socket: ReturnType<typeof io> | null = null;
let socketUrl: string | null = null;

// Initialize the socket with optional host IP
export const initSocket = (ip?: string) => {
  if (!socket) {
    // Use provided IP or fallback to the deployed server URL from env
    const baseUrl = ip ? `http://${ip}:3001` : process.env.EXPO_PUBLIC_SERVER_URL;
    if (!baseUrl) throw new Error("Socket URL not defined in .env and no IP provided");

    socketUrl = baseUrl;
    socket = io(socketUrl, { transports: ["websocket"] });
    console.log("Socket initialized at:", socketUrl);
  }
  return socket;
};

// Access the socket anywhere
export const getSocket = () => socket;

// Access the URL anywhere
export const getSocketUrl = () => socketUrl;
