import { Router } from 'express'
import {
  createCheckoutSession,
  handleStripeWebhook,
  getPaymentStatus,
} from '../controllers/paymentController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/create-checkout-session', authenticate, createCheckoutSession)
router.get('/:paymentId/status', authenticate, getPaymentStatus)
router.post('/webhook', handleStripeWebhook)

export default router