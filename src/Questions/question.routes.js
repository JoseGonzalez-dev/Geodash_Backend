import { Router } from 'express'
import { 
  getAllPreguntas, 
  getPreguntaById, 
  getPreguntasByCategoria, 
  getPreguntasByDificultad,
  createPregunta  // ← Agregar esta importación
} from './question.controller.js'

const api = Router()

// Agregar esta ruta
api.post('/', createPregunta)

// Las rutas que ya tienes
api.get('/', getAllPreguntas)
api.get('/:id', getPreguntaById)
api.get('/categoria/:id_categoria', getPreguntasByCategoria)
api.get('/dificultad/:dificultad', getPreguntasByDificultad)

export default api