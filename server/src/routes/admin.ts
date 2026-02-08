import { Router } from 'express';
import { getAllEssays, getEssayById, submitFeedback } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/essays', authenticate, requireAdmin, getAllEssays);
router.get('/essays/:id', authenticate, requireAdmin, getEssayById);
router.post('/essays/:id/feedback', authenticate, requireAdmin, submitFeedback);

export default router;
