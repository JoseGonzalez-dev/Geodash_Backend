import { Schema, model } from 'mongoose'

const streakSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        unique: true
    },
    currentStreak: {
        type: Number,
        default: 0,
        min: [0, 'Current streak cannot be negative']
    },
    longestStreak: {
        type: Number,
        default: 0,
        min: [0, 'Longest streak cannot be negative']
    },
    lastGameDate: {
        type: Date,
        default: null
    },
    streakStartDate: {
        type: Date,
        default: null
    },
    totalGamesPlayed: {
        type: Number,
        default: 0,
        min: [0, 'Total games cannot be negative']
    },
    consecutiveDays: {
        type: Number,
        default: 0,
        min: [0, 'Consecutive days cannot be negative']
    }
}, {
    versionKey: false,
    timestamps: true
})

// Índices para optimizar consultas
streakSchema.index({ currentStreak: -1 }) // Para rankings
streakSchema.index({ longestStreak: -1 }) // Para rankings

// Método para actualizar la racha
streakSchema.methods.updateStreak = function(gameDate) {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    // Si es el primer juego o si jugó ayer, incrementar racha
    if (!this.lastGameDate || this.isSameDay(this.lastGameDate, yesterday)) {
        this.currentStreak++
        this.consecutiveDays++
        
        // Actualizar la racha más larga si es necesario
        if (this.currentStreak > this.longestStreak) {
            this.longestStreak = this.currentStreak
        }
        
        // Si es el primer juego, establecer fecha de inicio
        if (!this.streakStartDate) {
            this.streakStartDate = gameDate
        }
    } 
    // Si jugó hoy, mantener la racha pero no incrementar
    else if (this.isSameDay(this.lastGameDate, today)) {
        // No hacer nada, mantener racha actual
    }
    // Si no jugó ayer ni hoy, romper la racha
    else {
        this.currentStreak = 1
        this.consecutiveDays = 1
        this.streakStartDate = gameDate
    }
    
    this.lastGameDate = gameDate
    this.totalGamesPlayed++
}

// Método helper para comparar fechas
streakSchema.methods.isSameDay = function(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
}

// Método para obtener estadísticas de racha
streakSchema.methods.getStreakStats = function() {
    return {
        currentStreak: this.currentStreak,
        longestStreak: this.longestStreak,
        consecutiveDays: this.consecutiveDays,
        totalGamesPlayed: this.totalGamesPlayed,
        lastGameDate: this.lastGameDate,
        streakStartDate: this.streakStartDate
    }
}

streakSchema.methods.toJSON = function() {
    const { __v, ...streak } = this.toObject()
    return streak
}

export default model('Streak', streakSchema)
