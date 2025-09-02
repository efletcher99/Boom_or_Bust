// socketService.ts
import io from "socket.io-client";

let socket: ReturnType<typeof io> | null = null;
let socketUrl: string | null = null;

// Initialize the socket with optional host IP
export const initSocket = (url: string) => {
  socketUrl = url;
  socket = io(url);
  console.log("Socket initialized at:", url);
  return socket;
};

// Access the socket anywhere
export const getSocket = () => socket;

// Access the URL anywhere
export const getSocketUrl = () => socketUrl;
