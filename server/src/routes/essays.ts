import { Router } from 'express'
import {
  getMyEssays,
  getEssayById,
  deleteEssay,
} from '../controllers/essayController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/my', authenticate, getMyEssays)
router.get('/:id', authenticate, getEssayById)
router.delete('/:id', authenticate, deleteEssay)

export default router