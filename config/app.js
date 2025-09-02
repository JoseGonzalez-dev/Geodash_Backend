import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"
import express from "express"
import { limiter } from "../middlewares/rate.limit.js"
import userRoutes from '../src/User/user.routes.js'
import authRoutes from '../src/Auth/auth.routes.js'
import categoryRoutes from '../src/Category/category.routes.js'
import questionRoutes from '../src/Questions/question.routes.js'
import gameRoutes from '../src/Game/game.routes.js'
import userAnswerRoutes from '../src/UserAnswer/userAnswer.routes.js'
import streakRoutes from '../src/Streak/streak.routes.js'
import optionAnswers from '../src/OpQuestions/opcion.routes.js'

const config = (app) => {
    app.use(helmet())
    app.use(cors())
    app.use(morgan("dev"))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(limiter)
}

const routes = (app)=>{ 
   app.use('/api/v1/geobash/user',userRoutes)
   app.use('/api/v1/geobash/auth',authRoutes)
   app.use('/api/v1/geobash/category',categoryRoutes)
   app.use('/api/v1/geobash/question',questionRoutes)
   app.use('/api/v1/geobash/answers', optionAnswers)
   app.use('/api/v1/geobash/game', gameRoutes)
   app.use('/api/v1/geobash/user_Answer', userAnswerRoutes)
   app.use('/api/v1/geobash/streak', streakRoutes)
}

export const initServer = () => {
    const app = express()
    try {
        config(app)
        routes(app)
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("Error al iniciar el servidor", error)
        process.exit(1)
    }
}
