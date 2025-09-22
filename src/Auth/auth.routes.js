import { Router } from "express"
import { 
    login, 
    register,
    loginWithGuestMigration  // ← Agregar esta importación
} from "./auth.controller.js"
import { userValidator } from "../../middlewares/validators.js"

const api = Router()

// 🎮 RUTAS PÚBLICAS (sin JWT) - Autenticación
api.post('/register', [userValidator], register)
api.post('/login', login)
api.post('/login-guest', loginWithGuestMigration)  

//Cron-Job
api.get('/keep-alive', (req, res) => {
    res.status(200).send('Servicio activo');
})

export default api