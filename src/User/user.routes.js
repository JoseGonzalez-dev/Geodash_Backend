import { Router } from "express";
import { addUser, changeProfilePicture, deleteUser, getUser, getUsers, updatePassword, updateUser } from "./user.controller.js";
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js";
import { uploadProfilePicture } from "../../middlewares/multer.upload.js";
import { deleteFileOnError } from "../../middlewares/delete.file.on.errors.js";
import { isAdminOr, isMyProfile, updatedUserValidator, userValidator } from "../../middlewares/validators.js";
import { getCurrentDir } from "../../middlewares/get.current.dir.js";
const api = Router()

api.post('/',[validateJwt,isAdmin,uploadProfilePicture.single('profilePicture'),userValidator,deleteFileOnError],addUser)
api.get('/get-employes',[validateJwt,isAdmin],getUsers)
api.get('/user/:id',[validateJwt],getUser)
api.put('/update/:id',[validateJwt,isMyProfile,updatedUserValidator],updateUser)
api.delete('/delete/:id',[validateJwt,isAdminOr,getCurrentDir],deleteUser)
api.put('/updatePassword',[validateJwt],updatePassword)
api.put('/updatePicture',[validateJwt,uploadProfilePicture.single('profilePicture'),deleteFileOnError],changeProfilePicture)

export default api