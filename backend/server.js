const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

//const io = new Server(server, { cors: { origin: "*" } });
//use after render is setup
const io = new Server(server, {
  cors: {
    origin: [process.env.EXPO_PUBLIC_SERVER_URL], // your React app URL
    methods: ["GET", "POST"]
  }
});

const games = {}; // store players by gameId

const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  // Host creates game
  socket.on("createGame", ({ gameId }) => {
    socket.join(gameId);
    if (!games[gameId]) games[gameId] = [];
    console.log(`Game created: ${gameId}`);
  });

  // Player joins game
  socket.on("joinGame", ({ gameId, nickname }) => {
    socket.join(gameId);
    if (!games[gameId]) games[gameId] = [];
    games[gameId].push({ id: socket.id, nickname });
    console.log(`${nickname} joined game ${gameId}`);

    io.to(gameId).emit("playersUpdate", games[gameId]);
    socket.emit("joinSuccess");
  });

  // Host starts the game
  socket.on("startGame", (gameId) => {
    io.to(gameId).emit("gameStarted");
    console.log(`Game ${gameId} started`);
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    for (let gameId in games) {
      games[gameId] = games[gameId].filter((p) => p.id !== socket.id);
      io.to(gameId).emit("playersUpdate", games[gameId]);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
