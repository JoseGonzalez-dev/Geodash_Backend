import { body } from "express-validator";
import { existCategory, existsEmail,existsUser,} from "../utils/db.validators.js";
import { validateErrors,validateErrorsGeneral, validateErrorsWhitoutFiles } from "./validate.errors.js";
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
    body('category')
        .notEmpty().withMessage('El ID de la categoría es requerido')
        .isMongoId().withMessage('El ID de la categoría debe ser un ID válido de MongoDB'),
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