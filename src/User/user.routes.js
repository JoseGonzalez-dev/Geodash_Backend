import { Router } from "express";
import { addUser, deleteUser, getUser, getUsers, updatePassword, updateUser } from "./user.controller.js";
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js";
import { isAdminOr, isMyProfile, updatedUserValidator, userValidator } from "../../middlewares/validators.js";
const api = Router()

api.post('/',[validateJwt,isAdmin,userValidator],addUser)
api.get('/get-employes',[validateJwt,isAdmin],getUsers)
api.get('/user/:id',[validateJwt],getUser)
api.put('/update/:id',[validateJwt,isMyProfile,updatedUserValidator],updateUser)
api.delete('/delete/:id',[validateJwt,isAdminOr],deleteUser)
api.put('/updatePassword',[validateJwt],updatePassword)

export default api