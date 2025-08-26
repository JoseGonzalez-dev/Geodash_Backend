import { Router } from 'express'
import { 
    getAllPreguntas, 
    getPreguntaById, 
    getPreguntasByCategoria, 
    getPreguntasByDificultad,
    getQuestionsForGuest  // ← Agregar esta importación
} from './question.controller.js'

const api = Router()

// 🎮 RUTAS PÚBLICAS (sin JWT) - Experiencia limitada
api.get('/guest', getQuestionsForGuest)  // Preguntas limitadas para invitados

// �� RUTAS PROTEGIDAS (con JWT) - Experiencia completa
api.get('/', getAllPreguntas)
api.get('/:id', getPreguntaById)
api.get('/categoria/:id_categoria', getPreguntasByCategoria)
api.get('/dificultad/:dificultad', getPreguntasByDificultad)

export default api