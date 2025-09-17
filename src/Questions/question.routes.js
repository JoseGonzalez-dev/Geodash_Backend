import { Router } from 'express'
import { questionValidator, updateQuestionValidator } from '../../middlewares/validators.js'
import { 
    createPregunta,
    getAllPreguntas, 
    getPreguntaById, 
    getPreguntasByCategoria, 
    getPreguntasByDificultad,
    getQuestionsForGuest
} from './question.controller.js'

const api = Router()

// Crear pregunta (para el script de poblado)
api.post('/', questionValidator, createPregunta)

// 🎮 RUTAS PÚBLICAS (sin JWT) - Experiencia limitada
api.get('/guest', getQuestionsForGuest)  // Preguntas limitadas para invitados

// RUTAS PROTEGIDAS (con JWT) - Experiencia completa
api.get('/', getAllPreguntas)
api.get('/:id', getPreguntaById)
api.get('/categoria/:id_categoria', getPreguntasByCategoria)
api.get('/dificultad/:dificultad', getPreguntasByDificultad)

export default api