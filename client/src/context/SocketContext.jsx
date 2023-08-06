import { createContext, useContext, useState, useEffect } from "react"
import { io } from "socket.io-client"

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket debe estar dentro del proveedor SocketProvider")
  }
  return context
}

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])

  const sendMessage = (message) => {
    socket.emit("message", message)
    setMessages([...messages, message])
  }

  const receiveMessage = (messages) => setMessages(messages)

  useEffect(() => {
    const socket = io("http://localhost:8080")
    setSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socket) return
    // Escuchar los eventos del servidor
    socket.on("messages", receiveMessage)

    return () => {
      return () => {
        socket.off("messages", receiveMessage)
      }
    }
  }, [socket])

  return (
    <SocketContext.Provider
      value={{
        socket,
        messages,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
