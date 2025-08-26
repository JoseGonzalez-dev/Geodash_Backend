import { Router } from 'express'
import {
  getPreguntasConOpciones,
  validarRespuesta
} from './opcion.controller.js'

const router = Router()

// Traer todas las preguntas con opciones (sin la correcta)
router.get('/preguntas-con-opciones', getPreguntasConOpciones)

// Validar la respuesta que eligió el usuario
router.post('/validar-respuesta', validarRespuesta)

export default router
