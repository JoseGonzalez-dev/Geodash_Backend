import { Schema, model } from 'mongoose'

const gameSchema = Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: function() { return !this.isGuest }, // Solo requerido si NO es invitado
            index: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
            index: true
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
            default: Date.now
        },
        endDate: {
            type: Date
        },
        totalScore: {
            type: Number,
            default: 0,
            min: [0, 'Score cannot be negative']
        },
        correctAnswers: {
            type: Number,
            default: 0,
            min: [0, 'Correct answers cannot be negative']
        },
        totalResponseTimeMs: {
            type: Number,
            default: 0,
            min: [0, 'Time cannot be negative']
        },
        // Nuevos campos para Guest
        isGuest: {
            type: Boolean,
            default: false
        },
        guestId: {
            type: String,
            sparse: true, // Puede ser null para usuarios registrados
            index: true
        },
        maxQuestions: {
            type: Number,
            default: 510, // 5 para invitados, 510 para registrados
            min: 5,
            max: 510
        }
    },
    { 
        versionKey: false,
        timestamps: true
    }
)

gameSchema.index({ user: 1, category: 1, startDate: -1 })
gameSchema.index({ guestId: 1, isGuest: 1 }) // Índice para invitados

gameSchema.methods.toJSON = function () {
    const { __v, ...game } = this.toObject()
    return game
}

export default model('Game', gameSchema)