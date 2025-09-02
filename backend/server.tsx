// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const SERVER_URL = process.env.SERVER_URL;
const io = new Server(server, {
  cors: {
    origin: SERVER_URL || "*", // or your frontend URL
    methods: ["GET", "POST"],
  },
});

// Keep track of players per game
const games: Record<string, { id: string; nickname: string }[]> = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Host creates a game
  socket.on("createGame", ({ gameId }) => {
    console.log(`Game created: ${gameId}`);
    games[gameId] = [];            // initialize empty player list
    socket.join(gameId);           // join host to the room
  });

  // Player joins a game
  socket.on("joinGame", ({ nickname, gameId }) => {
    if (!games[gameId]) {
      console.warn(`Game ${gameId} does not exist`);
      socket.emit("joinError", { message: "Game not found" });
      return;
    }

    const player = { id: socket.id, nickname };
    games[gameId].push(player);
    socket.join(gameId);

    // Notify all clients in this game
    io.to(gameId).emit("playersUpdate", games[gameId]);
    socket.emit("joinSuccess");
  });

  // Host starts the game
  socket.on("startGame", (gameId) => {
    console.log(`Game started: ${gameId}`);
    io.to(gameId).emit("gameStarted");
  });

  // Player leaves the game
  socket.on("leaveGame", ({ gameId }) => {
  if (games[gameId]) {
    games[gameId] = games[gameId].filter(p => p.id !== socket.id);
    io.to(gameId).emit("playersUpdate", games[gameId]);
  }
});

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    for (const gameId in games) {
      const index = games[gameId].findIndex(p => p.id === socket.id);
      if (index !== -1) {
        games[gameId].splice(index, 1);
        io.to(gameId).emit("playersUpdate", games[gameId]);
      }
    }
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
