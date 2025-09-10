import { body } from "express-validator";
import { existCategory, existsEmail,existsUser,} from "../utils/db.validators.js";
import { validateErrors,validateErrorsGeneral, validateErrorsWhitoutFiles } from "./validate.errors.js";
import Respuesta from "../src/OpQuestions/opcion.model.js";
import Pregunta from "../src/Questions/question.model.js";

export const isMyProfile=async(req,res,next)=>{
    try {
        let {id} = req.params
        let {user} = req
        if(user.uid != id)return res.send({success:false,message:'This is not your own profile'})
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).send({success:false,message:'Error whit authentication'})
    }
}

export const isAdminOr = async(req,res,next)=>{
    try {
        let {user} = req
        let {id} = req.params
        if(user.role === 'ADMIN'){
            next()
        }else if(user.uid != id){return res.send({success:false,message:'This is not your own profile'})
        }else{
            next()
        }
    } catch (error) {
        console.log(error);
        return res.status(401).send({success:false,message:'Error whit authenticating'})
    }
}

export const userValidator =[
    body('name','Name is required').notEmpty().isLength({min:3,max:30}),
    body('surname','Surname is required').notEmpty().isLength({min:3,max:30}),
    body('email','Email is required').notEmpty().isEmail().custom(existsEmail),
    body('username','Username is required').notEmpty().isLength({min:5,max:15}).custom(existsUser),
    body('password','Password is required').notEmpty().isLength({min:5,max:20}).isStrongPassword(),
    validateErrors
]

export const updatedUserValidator =[
    body('name','Name is required').optional().notEmpty().isLength({min:3,max:30}),
    body('surname','Surname is required').optional().notEmpty().isLength({min:3,max:30}),
    body('email','Email is required').optional().notEmpty().isEmail().custom(existsEmail),
    body('username','Username is required').optional().notEmpty().isLength({min:5,max:15}).custom(existsUser),
    validateErrorsWhitoutFiles
]

export const categoryValidator=[
    body('name','Name of category is required').optional().notEmpty().isLength({min:3,max:50}).custom(existCategory),
    body('description','Description of category is required').optional().notEmpty().isLength({min:10,max:150}),
    validateErrors
]

export const updateCategoryValidator=[
    body('name').optional().notEmpty().custom((category,{req})=>existCategory(category,{_id:req.params.id})),
    body('description').optional().notEmpty().isLength({min:3,max:50}),
    validateErrors
]

//-------------------------------------------- Game y User Answers --------------------------------------------

export const gameValidator = [
    body('user')
        .notEmpty().withMessage('El ID del usuario es requerido')
        .isMongoId().withMessage('El ID del usuario debe ser un ID válido de MongoDB'),
    body('difficulty')
        .notEmpty().withMessage('La dificultad es requerida')
        .isIn(['Fácil', 'Medio', 'Difícil']).withMessage('La dificultad debe ser: Fácil, Medio o Difícil'),
    validateErrors
]

export const guestGameValidator = [
    body('difficulty')
        .notEmpty().withMessage('La dificultad es requerida')
        .isIn(['Fácil', 'Medio', 'Difícil']).withMessage('La dificultad debe ser: Fácil, Medio o Difícil'),
    validateErrors
]

export const updateGameValidator = [
    body('endDate')
        .optional()
        .isISO8601().withMessage('La fecha de fin debe tener un formato válido (ISO 8601)')
        .toDate(),
    body('totalScore')
        .optional()
        .isNumeric().withMessage('La puntuación total debe ser un número')
        .isInt({ min: 0 }).withMessage('La puntuación total no puede ser negativa'),
    body('correctAnswers')
        .optional()
        .isNumeric().withMessage('El número de respuestas correctas debe ser un número')
        .isInt({ min: 0 }).withMessage('El número de respuestas correctas no puede ser negativo'),
    body('totalResponseTimeMs')
        .optional()
        .isNumeric().withMessage('El tiempo de respuesta total debe ser un número')
        .isInt({ min: 0 }).withMessage('El tiempo de respuesta total no puede ser negativo'),
    validateErrors
]

export const userAnswerValidator = [
    body('game')
        .notEmpty().withMessage('El ID de la partida es requerido')
        .isMongoId().withMessage('El ID de la partida debe ser un ID válido de MongoDB'),
    body('question')
        .notEmpty().withMessage('El ID de la pregunta es requerido')
        .isMongoId().withMessage('El ID de la pregunta debe ser un ID válido de MongoDB'),
    body('selectedOption')
        .notEmpty().withMessage('La opción seleccionada es requerida')
        .isLength({ min: 1, max: 200 }).withMessage('La opción seleccionada debe tener entre 1 y 200 caracteres'),
    body('responseTimeMs')
        .optional()
        .isNumeric().withMessage('El tiempo de respuesta debe ser un número')
        .isInt({ min: 0 }).withMessage('El tiempo de respuesta no puede ser negativo'),
    validateErrors
]

//-------------------------------------------- Questions y Respuestas --------------------------------------------

// Validations for questions
export const questionValidator = [
    body("texto", "El texto de la pregunta es requerido")
        .notEmpty()
        .isLength({ min: 5, max: 500 }),

    body("id_categoria", "La categoría es requerida")
        .notEmpty()
        .isMongoId()
        .custom(existCategory),

    body("dificultad", "La dificultad es requerida")
        .notEmpty()
        .isIn(["Fácil", "Medio", "Difícil"]),

    body("correcto", "La respuesta correcta es requerida")
        .notEmpty()
        .isLength({ min: 1, max: 200 }),

    body("explicacion")
        .optional()
        .isLength({ max: 1000 }),

    validateErrors
]

// Validations for updating questions
export const updateQuestionValidator = [
    body("texto")
        .optional()
        .notEmpty()
        .isLength({ min: 5, max: 500 }),

    body("id_categoria")
        .optional()
        .isMongoId()
        .custom(existCategory),

    body("dificultad")
        .optional()
        .isIn(["Fácil", "Medio", "Difícil"]),

    body("correcto")
        .optional()
        .notEmpty()
        .isLength({ min: 1, max: 200 }),

    body("explicacion")
        .optional()
        .isLength({ max: 1000 }),

    validateErrors
]

// Validar que la pregunta exista
const existPreguntaById = async (id) => {
    const pregunta = await Pregunta.findById(id)
    if (!pregunta) {
        console.error(`Pregunta con id ${id} no existe`)
        throw new Error(`Pregunta con id ${id} no existe`)
    }
}

// Crear respuesta
export const respuestaValidator = [
    body("id_pregunta", "La pregunta es requerida")
        .notEmpty()
        .isMongoId()
        .custom(existPreguntaById),

    body("texto_respuestas", "Debe haber al menos 2 opciones de respuesta")
        .isArray({ min: 2 })
        .custom((arr) => arr.every(opcion => typeof opcion === "string" && opcion.length >= 1 && opcion.length <= 200)),

    body("opcion_correcta", "Debe especificar la respuesta correcta")
        .notEmpty()
        .isString()
        .custom((val, { req }) => req.body.texto_respuestas.includes(val)),

    validateErrors
]

// Validar respuesta enviada por usuario
export const validarRespuestaValidator = [
    body("id_pregunta", "La pregunta es requerida")
        .notEmpty()
        .isMongoId()
        .custom(existPreguntaById),

    body("opcionElegida", "La opción elegida es requerida")
        .notEmpty()
        .isString()
        .custom(async (val, { req }) => {
            const respuesta = await Respuesta.findOne({ id_pregunta: req.body.id_pregunta })
            if (!respuesta) throw new Error("No hay respuestas registradas para esta pregunta")
            if (!respuesta.texto_respuestas.includes(val)) throw new Error("La opción elegida no es válida")
            return true
        }),

    validateErrors
]

//-------------------------------------------- Streak Validators --------------------------------------------

export const updateStreakValidator = [
    body('gameDate')
        .optional()
        .isISO8601().withMessage('La fecha del juego debe tener un formato válido (ISO 8601)')
        .toDate(),
    validateErrors
]