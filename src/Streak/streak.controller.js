import Streak from './streak.model.js'
import User from '../User/user.model.js'

// Obtener estadísticas de racha del usuario
export const getUserStreak = async (req, res) => {
    try {
        const { uid } = req.user
        
        let streak = await Streak.findOne({ user: uid })
        
        if (!streak) {
            // Crear streak si no existe
            streak = new Streak({ user: uid })
            await streak.save()
        }
        
        const stats = streak.getStreakStats()
        
        res.json({
            success: true,
            data: stats
        })
    } catch (error) {
        console.error('Error getting user streak:', error)
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        })
    }
}

// Actualizar racha cuando se completa un juego
export const updateUserStreak = async (req, res) => {
    try {
        const { uid } = req.user
        const { gameDate } = req.body
        
        let streak = await Streak.findOne({ user: uid })
        
        if (!streak) {
            streak = new Streak({ user: uid })
        }
        
        // Actualizar la racha con la fecha del juego
        const gameDateObj = gameDate ? new Date(gameDate) : new Date()
        streak.updateStreak(gameDateObj)
        
        await streak.save()
        
        const stats = streak.getStreakStats()
        
        res.json({
            success: true,
            message: 'Racha actualizada correctamente',
            data: stats
        })
    } catch (error) {
        console.error('Error updating user streak:', error)
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        })
    }
}

// Obtener ranking de rachas actuales
export const getStreakRanking = async (req, res) => {
    try {
        const { limit = 10 } = req.query
        
        const ranking = await Streak.find()
            .sort({ currentStreak: -1, longestStreak: -1 })
            .limit(parseInt(limit))
            .populate('user', 'name surname username')
            .select('currentStreak longestStreak totalGamesPlayed user')
        
        res.json({
            success: true,
            data: ranking
        })
    } catch (error) {
        console.error('Error getting streak ranking:', error)
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        })
    }
}

// Obtener ranking de rachas más largas
export const getLongestStreakRanking = async (req, res) => {
    try {
        const { limit = 10 } = req.query
        
        const ranking = await Streak.find()
            .sort({ longestStreak: -1, currentStreak: -1 })
            .limit(parseInt(limit))
            .populate('user', 'name surname username')
            .select('longestStreak currentStreak totalGamesPlayed user')
        
        res.json({
            success: true,
            data: ranking
        })
    } catch (error) {
        console.error('Error getting longest streak ranking:', error)
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        })
    }
}

// Obtener estadísticas globales de rachas
export const getGlobalStreakStats = async (req, res) => {
    try {
        const stats = await Streak.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    averageCurrentStreak: { $avg: '$currentStreak' },
                    averageLongestStreak: { $avg: '$longestStreak' },
                    maxCurrentStreak: { $max: '$currentStreak' },
                    maxLongestStreak: { $max: '$longestStreak' },
                    totalGamesPlayed: { $sum: '$totalGamesPlayed' }
                }
            }
        ])
        
        res.json({
            success: true,
            data: stats[0] || {}
        })
    } catch (error) {
        console.error('Error getting global streak stats:', error)
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        })
    }
}

// Reiniciar racha del usuario (para admins)
export const resetUserStreak = async (req, res) => {
    try {
        const { userId } = req.params
        
        // Verificar si el usuario es admin
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción'
            })
        }
        
        const streak = await Streak.findOne({ user: userId })
        
        if (!streak) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            })
        }
        
        // Reiniciar valores
        streak.currentStreak = 0
        streak.longestStreak = 0
        streak.consecutiveDays = 0
        streak.lastGameDate = null
        streak.streakStartDate = null
        
        await streak.save()
        
        res.json({
            success: true,
            message: 'Racha del usuario reiniciada correctamente'
        })
    } catch (error) {
        console.error('Error resetting user streak:', error)
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        })
    }
}
