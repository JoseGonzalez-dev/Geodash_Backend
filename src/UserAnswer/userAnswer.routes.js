import { Router } from 'express'
import { createUserAnswer, getUserAnswersByGame, getUserAnswerStats } from './userAnswer.controller.js'

const api = Router()

api.post('/', createUserAnswer)
api.get('/game/:gameId', getUserAnswersByGame)
api.get('/stats/:userId', getUserAnswerStats)

export default api