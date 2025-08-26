import { Schema, model } from 'mongoose'

const userAnswerSchema = Schema(
    {
        game: {
            type: Schema.Types.ObjectId,
            ref: 'Game',
            required: function() { return !this.isGuest }, // Solo requerido si NO es invitado
            index: true
        },
        question: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            index: true
        },
        selectedOption: {
            type: String,
        },
        isCorrect: {
            type: Boolean,
            default: false
        },
        responseTimeMs: {
            type: Number,
            default: 0,
        },
        // Nuevos campos para Guest
        isGuest: {
            type: Boolean,
            default: false
        },
        guestGameId: {
            type: String,
            sparse: true, // Puede ser null para usuarios registrados
            index: true
        }
    },
    { 
        versionKey: false, 
        timestamps: true 
    }
)

userAnswerSchema.index({ game: 1, question: 1 }, { unique: true })
userAnswerSchema.index({ guestGameId: 1, isGuest: 1 }) // Índice para invitados

userAnswerSchema.methods.toJSON = function () {
    const { __v, ...userAnswer } = this.toObject()
    return userAnswer
}

export default model('UserAnswer', userAnswerSchema)