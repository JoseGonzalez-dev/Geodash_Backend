import { Router } from 'express'
import {
  getAllPreguntas,
  getPreguntaById,
  getPreguntasByCategoria,
  getPreguntasByDificultad
} from './question.controller.js'

const router = Router()


router.get('/', getAllPreguntas)                         // todas las preguntas
router.get('/:id', getPreguntaById)                      // una pregunta por id
router.get('/categoria/:id_categoria', getPreguntasByCategoria)  // preguntas por categoría
router.get('/dificultad/:dificultad', getPreguntasByDificultad)  // preguntas por dificultad

export default router
