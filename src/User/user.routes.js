import { Router } from 'express'
import { 
    addUser, 
    deleteUser, 
    getUser, 
    getUsers, 
    updatePassword, 
    updateUser,
    findEmail,
    findUsername,
    migrateGuestToUser  // ← Agregar esta importación
} from "./user.controller.js"
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js"
import { isAdminOr, isMyProfile, updatedUserValidator, userValidator } from "../../middlewares/validators.js"

const api = Router()

// 🎮 RUTAS PÚBLICAS (sin JWT) - Migración de invitado
api.post('/migrate-guest', migrateGuestToUser)  // Migrar invitado a usuario

// �� RUTAS PROTEGIDAS (con JWT) - Usuarios registrados
api.post('/', [validateJwt, isAdmin, userValidator], addUser)
api.get('/get-employes', [validateJwt, isAdmin], getUsers)
api.get('/user/:id', [validateJwt], getUser)
api.put('/update/:id', [validateJwt, isMyProfile, updatedUserValidator], updateUser)
api.delete('/delete/:id', [validateJwt, isAdminOr], deleteUser)
api.put('/updatePassword/:id', [validateJwt], updatePassword)
api.post('/username-exist',findUsername)
api.post('/email-exist',findEmail)

export default api