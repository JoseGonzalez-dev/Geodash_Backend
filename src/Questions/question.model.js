import { Schema, model } from 'mongoose'

const questionSchema = Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    question: {
        type: String,
        required: [true, 'Question is required']
    },
    answer: {
        type: String,
        required: [true, 'Answer is required']
    }
},
    { versionKey: false }
)

export default model('Question', questionSchema)
