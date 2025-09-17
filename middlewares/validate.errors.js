import { validationResult } from "express-validator"

export const validateErrors = (req,res,next)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json(error)
    }
    next()
}

export const validateErrorsGeneral = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors
        })
    }
    next()
} 

export const validateErrorsWhitoutFiles = (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send(
            {
                succes:false,
                message: 'Error whit validations',
                errors: errors.errors
            }
        )
    }
    next()
}