import { Router } from 'express'
import { 
    getUserStreak, 
    updateUserStreak, 
    getStreakRanking, 
    getLongestStreakRanking, 
    getGlobalStreakStats, 
    resetUserStreak 
} from './streak.controller.js'
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'
import { limiter } from '../../middlewares/rate.limit.js'
import { updateStreakValidator } from '../../middlewares/validators.js'

const api = Router()

// 🔥 RUTAS PROTEGIDAS (con JWT) - Sistema de rachas
api.get('/my-streak', [validateJwt, limiter], getUserStreak)
api.post('/update-streak', [validateJwt, limiter, updateStreakValidator], updateUserStreak)

// 📊 RUTAS DE RANKING Y ESTADÍSTICAS
api.get('/ranking/current', [validateJwt, limiter], getStreakRanking)
api.get('/ranking/longest', [validateJwt, limiter], getLongestStreakRanking)
api.get('/stats/global', [validateJwt, limiter], getGlobalStreakStats)

// 🛡️ RUTAS DE ADMINISTRADOR
api.delete('/reset/:userId', [validateJwt, isAdmin, limiter], resetUserStreak)

export default api
