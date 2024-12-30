import { useState, useEffect } from 'react'
import './App.css'
import io from "socket.io-client"

const socket = io('http://192.168.7.246:4000')

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ body: "Envie un mensaje", from: "Bot" }]);

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', message)
    const newMessage = {
      body: message,
      from: "Me"
    }
    setMessages([newMessage, ...messages])
    console.log(messages)
    setMessage("")
    // setMessage("")
  }

  useEffect(() => {
    const receivedMessage = (data) => {
      setMessages([data, ...messages])
    }
    socket.on('message', receivedMessage)
    return () => {
      socket.off('message', receivedMessage)
    }
  }, [messages])



  return (
    <>
      <div className='h-screen bg-zinc-800 text-white flex items-center justify-center'>
        <form className='bg-zinc-900 p-10' onSubmit={handleSubmit}>
          <h1 className='text-2xl text-center mb-2'>Chat con SocketIO</h1>
          <input className='border-2 rounded-md border-zinc-500 p-2 text-black w-full' placeholder='Type a message' value={message} onChange={(e) => setMessage(e.target.value)} type="text" />
          {/* <button className='px-4 py-2 rounded-md bg-blue-600 w-full mt-1' type='submit'>Send</button> */}
          <ul className='h-80 overflow-y-auto'>
            {messages.map((message, index) => (
              <li key={index} className={`my-2 p-2 table text-sm rounded-md ${message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-zinc-800"}`}>
                <p>
                  {message && message.from && message.body ? `${message.from}: ${message.body}` : ``}
                </p>
              </li>
            ))}
          </ul>
        </form>
      </div>
    </>
  )
}

export default App
