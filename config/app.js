import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"
import express from "express"
import { limiter } from "../middlewares/rate.limit.js"
import userRoutes from '../src/User/user.routes.js'
import authRoutes from '../src/auth/auth.routes.js'
import categoryRoutes from '../src/Category/category.routes.js'

const config = (app) => {
    app.use(helmet())
    app.use(cors())
    app.use(morgan("dev"))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(limiter)
}

const routes = (app)=>{ 
   app.use('/user',userRoutes)
   app.use('/auth',authRoutes)
   app.use('/category',categoryRoutes)
}

export const initServer = () => {
    const app = express()
    try {
        config(app)
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("Error al iniciar el servidor", error)
        process.exit(1)
    }
}