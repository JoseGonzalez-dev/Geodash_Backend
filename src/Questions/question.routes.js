import { Router } from 'express'
import {
  addQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
} from './question.controller.js'

const router = Router()


router.post('/', addQuestion)            
router.get('/', getAllQuestions)         
router.get('/:id', getQuestionById)      
router.put('/:id', updateQuestion)       
router.delete('/:id', deleteQuestion)    

export default router
