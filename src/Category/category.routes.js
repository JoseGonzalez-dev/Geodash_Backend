import { Router } from "express";
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js";
import { categoryValidator, updateCategoryValidator } from "../../middlewares/validators.js";
import { addCategory, deleteCategory, findCategory, listCategories, updateCategory } from "./category.controller.js";


const api = Router()

api.post('/category-register', [validateJwt,isAdmin, categoryValidator],addCategory)

api.get('/category-list', listCategories)
api.get('/:id', findCategory)
api.put('/category-update/:id', [validateJwt, isAdmin, updateCategoryValidator], updateCategory)
api.delete('/category-delete/:id',[validateJwt,isAdmin],deleteCategory)

export default api