import { Router } from 'express'
import { 
    createUserAnswer, 
    getUserAnswersByGame, 
    getUserAnswerStats,
    createGuestAnswer  // ← Agregar esta importación
} from './userAnswer.controller.js'
import { validateJwt, isClient, isAdmin } from '../../middlewares/validate.jwt.js'
import { limiter } from '../../middlewares/rate.limit.js'
import { userAnswerValidator } from '../../middlewares/validators.js'

const api = Router()

// 🎮 RUTAS PÚBLICAS (sin JWT) - Experiencia limitada -> by IA
api.post('/guest', [limiter], createGuestAnswer)  // Respuesta de invitado -> By IA


api.post('/create', [validateJwt, limiter, userAnswerValidator], createUserAnswer)
api.get('/game/:gameId', [validateJwt], getUserAnswersByGame)
api.get('/stats/:userId', [validateJwt], getUserAnswerStats)

export default api