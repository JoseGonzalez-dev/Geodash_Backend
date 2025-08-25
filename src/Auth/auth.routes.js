import { Router } from "express";
import { login, register } from "./auth.controller.js";
import { userValidator } from "../../middlewares/validators.js";

const api = Router()

api.post('/register',[userValidator],register)
api.post('/login',login)


export default api