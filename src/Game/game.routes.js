import { Router } from 'express'
import { 
    createGame, 
    getGames, 
    getGameById, 
    updateGame, 
    getUserGames,
    createGuestGame  // ← Agregar esta importación
} from './game.controller.js'
import { validateJwt, isClient, isAdmin } from '../../middlewares/validate.jwt.js'
import { limiter } from '../../middlewares/rate.limit.js'
import { gameValidator, updateGameValidator } from '../../middlewares/validators.js'

const api = Router()

// 🎮 RUTAS PÚBLICAS (sin JWT) - Experiencia limitada
api.post('/guest', [limiter], createGuestGame)  // Crear partida de invitado

// �� RUTAS PROTEGIDAS (con JWT) - Experiencia completa
api.post('/', [validateJwt, isClient, limiter, gameValidator], createGame)
api.get('/', [validateJwt, isAdmin], getGames)
api.get('/:id', [validateJwt], getGameById)
api.patch('/:id', [validateJwt, updateGameValidator], updateGame)
api.get('/user/:userId', [validateJwt], getUserGames)

export default api