const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Socket logic
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", ({ name, room }) => {
    if (!name || !room) return;

    socket.username = name;
    socket.room = room;
    socket.join(room);

    socket.emit("system", `Willkommen ${name} im Raum ${room}`);
    socket.to(room).emit("system", `${name} ist beigetreten`);
  });

  socket.on("message", (msg) => {
    if (!socket.room) return;
    io.to(socket.room).emit("message", {
      name: socket.username,
      text: msg,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("disconnect", () => {
    if (socket.username && socket.room) {
      socket.to(socket.room).emit("system", `${socket.username} hat den Chat verlassen`);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log("Chat läuft auf http://localhost:" + PORT);
});
