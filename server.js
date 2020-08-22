const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Crear static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chat Bot";

//Se ejecuta cuando un cliente se conecta
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Bienvenida al usuario actual
    socket.emit("message", formatMessage(botName, "Bienvenido a Chaty Chat"));

    //Se emite cuando un usuario se conecta
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} se ha unido al chat`)
      );

    // Enviar Info de usuarios y salas
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Escuchar mensajes del Chat
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Se ejejuta cuando un cliente se desconecta
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} ha salido del chat`)
      );
    }

    // Enviar Info de usuarios y salas
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
});

//Settings
const PORT = 3000 || process.env.PORT;

//Lanzamiento
server.listen(PORT, () => console.log(`server on port ${PORT}`));
