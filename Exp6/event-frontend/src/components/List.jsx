import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function List() {
  const [data, setData] = useState([])
  const api = "http://localhost:5000/registrations"

  const load = async () => {
    const res = await axios.get(api)
    setData(res.data)
  }

  useEffect(() => {
    load()
  }, [])

  const del = async (id) => {
    const res = await axios.delete(api + "/" + id)
    if (res.status === 200) {
      toast.success("Deleted successfully")
    } else {
      toast.error("Error: " + res.data.error)
    }
    load()
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h2 className="text-white text-xl mb-6 text-center">Registrations</h2>

      <div className="max-w-xl mx-auto space-y-3">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-gray-800 p-4 rounded flex justify-between items-center"
          >
            <div className="text-white">
              <p>{item.name}</p>
              <p className="text-sm text-gray-400">{item.eventName}</p>
            </div>

            <button
              onClick={() => del(item._id)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List