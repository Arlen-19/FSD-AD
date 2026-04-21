import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const db = mongoose.connect(process.env.MONGODB_URI)
if (db) {
  console.log("Connected to MongoDB")
}

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  eventName: { type: String, required: true }
})

const Registration = mongoose.model("Registration", registrationSchema)

app.post("/registrations", async (req, res) => {
  try {
    const data = await Registration.create(req.body)
    res.json(data)
  } catch {
    res.status(400).json({ error: "Email must be unique" })
  }
})

app.get("/registrations", async (req, res) => {
  const data = await Registration.find()
  res.json(data)
})

app.delete("/registrations/:id", async (req, res) => {
  await Registration.findByIdAndDelete(req.params.id)
  res.json({ message: "Deleted" })
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})