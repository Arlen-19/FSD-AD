import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [eventName, setEventName] = useState("")

  const api = "http://localhost:3000/registrations"

  const submit = async (e) => {
    e.preventDefault()

    const res = await axios.post(api, {
      name,
      email,
      eventName
    })
    if (res.status === 200) {
      toast.success("Registered successfully")
    } else {
      toast.error("Error: " + res.data.error)
    }

    setName("")
    setEmail("")
    setEventName("")
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-80">
        <h2 className="text-white text-xl mb-6 text-center">Register</h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full p-2 rounded bg-gray-700 text-white outline-none"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="w-full p-2 rounded bg-gray-700 text-white outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full p-2 rounded bg-gray-700 text-white outline-none"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register