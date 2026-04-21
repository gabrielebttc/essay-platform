import { Router } from 'express'
import {
  getMyEssays,
  getEssayById,
  deleteEssay,
  getEssayTypes,
} from '../controllers/essayController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/my', authenticate, getMyEssays)
router.get('/essay-types', authenticate, getEssayTypes)
router.get('/:id', authenticate, getEssayById)
router.delete('/:id', authenticate, deleteEssay)

export default router