import { app } from "./src/app.js"
import http from "http"
import { CLUSTER, PORT, connectDB } from "./src/config.js"
import { Logger } from "./src/logger/index.js"
import cluster from "cluster"
import os from "os"
import { Server as ServerSocket } from "socket.io"

const numCPUs = os.cpus().length

const server = http.createServer(app)
const io = new ServerSocket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true,
})

if (cluster.isPrimary && String(CLUSTER) == "true") {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on("exit", (worker, code, signal) => {
    Logger.error(`El worker ${worker.process.pid} murio`)
    cluster.fork()
  })
} else {
  await connectDB()
  server.listen(PORT, () => {
    Logger.info(`Servidor corriendo en el puerto ${PORT}`)
  })
}

const messages = []

io.on("connection", (socket) => {
  console.log("a user connected", socket.id)
  socket.emit("messages", messages)

  socket.on("message", (data) => {
    const { message, email } = data
    messages.push({ message, email })

    socket.broadcast.emit("messages", messages)
  })
})
