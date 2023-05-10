// const express = require("express")
// const http = require("http")
const io = require("socket.io")(3000, {
    cors: {
      origin: ['http://localhost:8080'],
    },
  })

// const app = express()
// const server = http.createServer(app)


io.on("connection", socket => {
    console.log(socket.id);
})