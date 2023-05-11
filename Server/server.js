const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
})

const users = []

io.on("connection", (socket) => {
  console.log(`${socket.id} has connnected`)

  socket.on("disconnect", () => {
    const index = users.findIndex((user) => {
        if (user.id === socket.id) {
          return true
        }
      })

    if (index > -1) {
      users.splice(index, 1)
      console.log("Um usuário se desconectou:", socket.id)
      socket.emit("message", "Você foi desconectado")
    }
  })

  socket.on("joinQueue", ({ ...queueObject }) => {
    const user = {
      id: socket.id,
      username: queueObject.user.name,
      queue: queueObject.room_id,
      user_id: queueObject.user.user_id, //PRECISA MSM DISSO?
    }

    users.push(user)
    socket.join(user.queue)
    socket.emit("message", "Welcome to application " + user.username)
    console.log(`${user.username} is ready for connection`)

    socket.broadcast
      .to(user.queue)
      .emit("message", `${user.username} has joined the call`)

    io.to(user.queue).emit("queueUsers", {
      queue: user.queue,
      users: users.filter((queueUser) => queueUser.queue === user.queue),
    })

    io.to(user.queue).emit("queueSettings", {
      ...queueObject,
    })
  })

  socket.on("queuePosition", () => {
    for (let position = 0; position < users.length; position++) {
      const user = users[position]
      if (user.id === socket.id) {
        socket.emit("position", {
          position: position + 1,
        })
        return
      }
    }
  })

  socket.on("answerNext", () => {
    if ( undefined === users.shift()) { //CHECAR SE A FILA ESTA VAZIA
        console.log("Fila vazia");
    } else {
        // RETIRAR O PRIMEIRO DA FILA
    }

  })

  socket.on("teste", () => {
    console.log("teste enviado")
    //socket.join("teste");
    socket.emit("teste", "Teste enviado")
    socket.broadcast.emit("teste", "Teste enviado")
  })
})

// io.on("connection", (socket) => {
//     console.log("Um usuário se conectou:", socket.id)

//     waitingQueue.push(socket.id)
//     totalClients++

//     socket.on("disconnect", () => {
//       console.log("Um usuário se desconectou:", socket.id)
//       const index = waitingQueue.indexOf(socket.id)
//       if (index !== -1) {
//         waitingQueue.splice(index, 1)
//         io.emit("userDisconnected", { userId: socket.id })
//       }
//     })

//     io.to(socket.id).emit("queuePosition", {
//       position: waitingQueue.length,
//       averageWaitingTime:
//         totalClients === 1 ? 0 : averageWaitingTime / (totalClients - 1),
//     })

//     socket.on("sessionStarted", (data) => {
//       const { waitingTime } = data
//       totalWaitingTime += waitingTime
//       averageWaitingTime = totalWaitingTime / totalClients

//       const index = waitingQueue.indexOf(socket.id)
//       if (index !== -1) {
//         waitingQueue.splice(index, 1)
//       }

//       io.emit("queueUpdate", {
//         waitingQueue,
//         averageWaitingTime,
//       })
//     })
//   })
