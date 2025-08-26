import { Schema, model } from 'mongoose'

const questionSchema = Schema(
  {
    texto: {
      type: String,
      required: [true, 'El texto de la pregunta es requerido'],
      maxLength: [500, 'La pregunta no puede superar los 500 caracteres']
    },
    id_categoria: {
      type: Schema.Types.ObjectId, 
      ref: 'Categoria', 
      required: [true, 'La categoría es requerida']
    },
    dificultad: {
      type: String,
      enum: ['Fácil', 'Medio', 'Difícil'],
      required: [true, 'La dificultad es requerida']
    },
    correcto: {
      type: String,
      required: [true, 'La respuesta correcta es requerida']
    },
    explicacion: {
      type: String,
      maxLength: [1000, 'La explicación no puede superar los 1000 caracteres'],
      default: ''
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default model('Pregunta', questionSchema)
