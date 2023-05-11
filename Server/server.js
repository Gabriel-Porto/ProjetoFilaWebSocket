const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});
const users = [];
io.on("connection", (socket) => {
  console.log("socket is ready for connection");
  socket.on("joinRoom", ({ ...roomObject }) => {
    const user = {
      id: socket.id,
      username: roomObject.user.name,
      room: roomObject.room_uuid,
      user_id: roomObject.user.user_uuid,
    };
    users.push(user);
    socket.join(user.room);
    socket.emit("message", "Welcome to application" + user.username);
    socket.broadcast
      .to(user.room)
      .emit("message", `${user.username} has joined the call`);

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: users.filter((queueUser) => queueUser.room === user.room),
    });
    io.to(user.room).emit("roomSettings", {
      ...roomObject,
    });
  });

  socket.on("teste", () => {
    console.log("teste enviado");
    //socket.join("teste");
    socket.emit("teste", "Teste enviado");
    socket.broadcast.emit("teste", "Teste enviado");
  });
});
