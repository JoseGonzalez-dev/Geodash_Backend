import Pregunta from '../Questions/question.model.js'
import Respuesta from './opcion.model.js'

// Crear opciones de respuesta para una pregunta
export const createRespuesta = async (req, res) => {
  try {
    const { id_pregunta, texto_respuestas, opcion_correcta } = req.body

    // Validar campos requeridos
    if (!id_pregunta || !texto_respuestas || !opcion_correcta) {
      return res.status(400).send({
        success: false,
        message: 'Todos los campos son requeridos: id_pregunta, texto_respuestas, opcion_correcta'
      })
    }

    // Verificar que la pregunta existe
    const pregunta = await Pregunta.findById(id_pregunta)
    if (!pregunta) {
      return res.status(404).send({
        success: false,
        message: 'La pregunta especificada no existe'
      })
    }

    // Verificar que no existan ya opciones para esta pregunta
    const respuestaExistente = await Respuesta.findOne({ id_pregunta })
    if (respuestaExistente) {
      return res.status(400).send({
        success: false,
        message: 'Ya existen opciones de respuesta para esta pregunta'
      })
    }

    // Crear las opciones de respuesta
    const nuevaRespuesta = await Respuesta.create({
      id_pregunta,
      texto_respuestas,
      opcion_correcta
    })

    return res.status(201).send({
      success: true,
      message: 'Opciones de respuesta creadas correctamente',
      respuesta: nuevaRespuesta
    })

  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'Error al crear opciones de respuesta',
      err: err.message
    })
  }
}

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
