import Pregunta from '../Questions/question.model.js'
import Respuesta from './opcion.model.js'

//Traer preguntas con sus opciones (SIN mostrar la correcta)
export const getPreguntasConOpciones = async (req, res) => {
  try {
    const preguntas = await Pregunta.find().sort({ createdAt: -1 })

    const data = await Promise.all(
      preguntas.map(async (pregunta) => {
        const respuestas = await Respuesta.findOne({ id_pregunta: pregunta._id })

        return {
          id: pregunta._id,
          texto: pregunta.texto,
          dificultad: pregunta.dificultad,
          categoria: pregunta.id_categoria,
          opciones: respuestas ? respuestas.texto_respuestas : [] 
        }
      })
    )

    return res.send({
      success: true,
      message: 'Preguntas con opciones cargadas',
      preguntas: data
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'Error al obtener preguntas con opciones',
      err
    })
  }
}

// Validar la opción elegida por el usuario
export const validarRespuesta = async (req, res) => {
  try {
    const { id_pregunta, opcionElegida } = req.body

    const respuesta = await Respuesta.findOne({ id_pregunta })
    if (!respuesta) {
      return res.status(404).send({
        success: false,
        message: 'No hay respuestas registradas para esta pregunta'
      })
    }

    const esCorrecta = respuesta.opcion_correcta === opcionElegida

    return res.send({
      success: true,
      correcta: esCorrecta,
      mensaje: esCorrecta ? 'Respuesta correcta 🎉' : 'Respuesta incorrecta ❌'
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'Error al validar respuesta',
      err
    })
  }
}
