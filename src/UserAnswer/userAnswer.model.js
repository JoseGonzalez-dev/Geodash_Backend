import { Schema, model } from 'mongoose'

const userAnswerSchema = Schema(
    {
        game: {
            type: Schema.Types.ObjectId,
            ref: 'Game',
            required: [true, 'Game is required'],
            index: true
        },
        question: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: [true, 'Question is required'],
            index: true
        },
        selectedOption: {
            type: String,
            required: [true, 'Selected option is required']
        },
        isCorrect: {
            type: Boolean,
            required: true,
            default: false
        },
        responseTimeMs: {
            type: Number,
            default: 0,
            min: [0, 'Time cannot be negative']
        }
    },
    { 
        versionKey: false, 
        timestamps: true 
    }
)

userAnswerSchema.index({ game: 1, question: 1 }, { unique: true })

userAnswerSchema.methods.toJSON = function () {
    const { __v, ...userAnswer } = this.toObject()
    return userAnswer
}

export default model('UserAnswer', userAnswerSchema)