import { Router } from 'express'
import {
  createPaymentLink,
  createCheckoutSession,
  handleStripeWebhook,
  getPaymentStatus,
} from '../controllers/paymentController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/create-payment-link', authenticate, createPaymentLink)
router.post('/create-checkout-session', authenticate, createCheckoutSession) // Keep for backward compatibility
router.get('/:paymentId/status', authenticate, getPaymentStatus)
router.post('/webhook', handleStripeWebhook)

export default router