import { useState } from "react"
import { useSocket } from "../context/SocketContext"
import { useUser } from "../context/UserContext"

const Chat = () => {
  const [message, setMessage] = useState("") // Initialize as an empty string
  const { messages, sendMessage } = useSocket()
  const { user } = useUser()

  const handleChange = (e) => {
    setMessage(e.target.value) // Update the message directly with the input value
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage({ email: user?.email || "Anonimo", message })
    setMessage("")
  }

  return (
    <div>
      <h1 className="text-3xl text-center my-10">Chat</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <p>
              {message.email}: {message.message}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={handleChange}
          name="message"
          className="text-black"
        />
        <button>Enviar</button>
      </form>
    </div>
  )
}

export default Chat
