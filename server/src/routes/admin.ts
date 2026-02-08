import { Router } from 'express';
import { getAllEssays, getEssayById, submitFeedback, getFeedbackHistory, getDashboardStats } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, requireAdmin, getDashboardStats); // New route
router.get('/essays', authenticate, requireAdmin, getAllEssays);
router.get('/essays/:id', authenticate, requireAdmin, getEssayById);
router.get('/essays/:essayId/history', authenticate, requireAdmin, getFeedbackHistory);
router.post('/essays/:id/feedback', authenticate, requireAdmin, submitFeedback);

export default router;
