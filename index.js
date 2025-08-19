import { connectDB } from "./config/mongo.js"
import { initServer } from "./config/app.js"
import { config } from "dotenv"

config()
connectDB()
initServer()