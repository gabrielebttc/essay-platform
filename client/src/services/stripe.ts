import { api } from './api'

const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_stripe_publishable_key' // Replace with your actual key

export const redirectToCheckout = async (taskType: 'task1' | 'task2', content: string) => {
  try {
    const response = await api.post('/payments/create-checkout-session', {
      taskType,
      content,
    })

    if (!STRIPE_PUBLISHABLE_KEY) {
      throw new Error('Stripe publishable key not configured')
    }

    const { sessionId } = response.data
    const stripe = (await import('@stripe/stripe-js')).loadStripe(STRIPE_PUBLISHABLE_KEY)
    const stripeInstance = await stripe

    if (!stripeInstance) {
      throw new Error('Failed to load Stripe')
    }

    await (stripeInstance as any).redirectToCheckout({ sessionId })


  } catch (error: any) {
    console.error('Payment redirect error:', error)
    throw new Error(error.message || 'Failed to process payment')
  }
}