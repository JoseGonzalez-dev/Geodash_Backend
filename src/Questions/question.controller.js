import Pregunta from './pregunta.model.js'

// Obtener todas las preguntas (con paginación) by chatgpt
export const getAllPreguntas = async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query

    const preguntas = await Pregunta.find()
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))

    if (preguntas.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No hay preguntas registradas'
      })
    }

    return res.send({
      success: true,
      message: 'Preguntas encontradas',
      preguntas
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'Error al obtener preguntas',
      err
    })
  }
}

// Obtener una pregunta por ID
export const getPreguntaById = async (req, res) => {
  try {
    const { id } = req.params
    const pregunta = await Pregunta.findById(id)

    if (!pregunta) {
      return res.status(404).send({
        success: false,
        message: 'Pregunta no encontrada'
      })
    }

    return res.send({
      success: true,
      message: 'Pregunta encontrada',
      pregunta
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'Error al obtener la pregunta',
      err
    })
  }
}

// Obtener preguntas por categoría
export const getPreguntasByCategoria = async (req, res) => {
  try {
    const { id_categoria } = req.params
    const preguntas = await Pregunta.find({ id_categoria }).sort({ createdAt: -1 })

    if (preguntas.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No se encontraron preguntas para esta categoría'
      })
    }

    return res.send({
      success: true,
      message: 'Preguntas encontradas',
      preguntas
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'Error al obtener preguntas por categoría',
      err
    })
  }
}

// Obtener preguntas por dificultad
export const getPreguntasByDificultad = async (req, res) => {
  try {
    const { dificultad } = req.params
    const preguntas = await Pregunta.find({ dificultad }).sort({ createdAt: -1 })

    if (preguntas.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No se encontraron preguntas con esa dificultad'
      })
    }

    return res.send({
      success: true,
      message: 'Preguntas encontradas',
      preguntas
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'Error al obtener preguntas por dificultad',
      err
    })
  }
}
