import { Router } from 'express'
import { respuestaValidator, validarRespuestaValidator } from "../middlewares/validators.js"
import {
  getPreguntasConOpciones,
  validarRespuesta
} from './opcion.controller.js'

const router = Router()

// Traer todas las preguntas con opciones (sin la correcta)
router.get('/preguntas-con-opciones', getPreguntasConOpciones)

// Validar la respuesta que eligió el usuario
router.post('/validar-respuesta', validarRespuesta, validarRespuestaValidator)

export default router
