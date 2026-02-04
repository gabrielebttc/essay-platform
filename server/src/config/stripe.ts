import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15' as any,
})

export const PRICES = {
  TASK1: { amount: 2000, name: 'IELTS Writing Task 1 Review' },
  TASK2: { amount: 2500, name: 'IELTS Writing Task 2 Review' },
}

export default stripe