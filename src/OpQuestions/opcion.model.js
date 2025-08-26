import { Schema, model } from 'mongoose'

const respuestaSchema = Schema(
  {
    id_pregunta: {
      type: Schema.Types.ObjectId,
      ref: 'Pregunta', // referencia al modelo de Pregunta
      required: [true, 'La pregunta es requerida']
    },
    texto_respuestas: {
      type: [String], // un array de opciones de respuesta
      validate: {
        validator: (arr) => arr.length >= 2,
        message: 'Debe haber al menos 2 opciones de respuesta'
      },
      required: [true, 'Las respuestas son requeridas']
    },
    opcion_correcta: {
      type: String,
      required: [true, 'Debe especificar la respuesta correcta'],
      validate: {
        validator: function (val) {
          return this.texto_respuestas.includes(val)
        },
        message: 'La respuesta correcta debe estar dentro de las opciones'
      }
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default model('Respuesta', respuestaSchema)
