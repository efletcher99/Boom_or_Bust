// socketService.ts
import io from "socket.io-client";

let socket: ReturnType<typeof io> | null = null;
let socketUrl: string | null = null;

// Initialize the socket with the host IP
export const initSocket = (ip: string) => {
  socketUrl = `http://${ip}:3001`;
  socket = io(socketUrl);
  console.log("Socket initialized at:", socketUrl);
  return socket;
};

// Access the socket anywhere
export const getSocket = () => socket;

// Access the URL anywhere
export const getSocketUrl = () => socketUrl;
