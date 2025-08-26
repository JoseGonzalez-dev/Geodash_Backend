import { Router } from 'express'
import { 
    createGame,
    getGames, 
    getGameById, 
    updateGame, 
    getUserGames 
} from './game.controller.js'

const api = Router()

api.post('/newGame', createGame)
api.get('/gameGet', getGames)
api.get('/userGame/:userId', getUserGames)
api.get('/gameAll/:id', getGameById)
api.put('/gameUpdate/:id', updateGame)

export default api