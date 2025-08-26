import { Schema, model } from 'mongoose'

const gameSchema = Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            index: true
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
            default: null
        },
        totalScore: {
            type: Number,
            default: 0,
        },
        correctAnswers: {
            type: Number,
            default: 0,
        },
        totalResponseTimeMs: {
            type: Number,
            default: 0,
        }
    },
    { 
        versionKey: false,
        timestamps: true
    }
)

gameSchema.index({ user: 1, category: 1, startDate: -1 })

gameSchema.methods.toJSON = function () {
    const { __v, ...game } = this.toObject()
    return game
}

export default model('Game', gameSchema)