export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'admin'
  targetBandScore?: number
  createdAt: string
}

export interface Essay {
  id: string
  userId: string
  taskType: 'task1' | 'task2'
  content: string
  status: 'pending_payment' | 'pending' | 'in_review' | 'completed'
  submittedAt: string
  paymentId?: string
  feedback?: EssayFeedback
}

export interface EssayFeedback {
  id: string
  essayId: string
  overallBandScore: number
  taskAchievement: number
  coherence: number
  lexicalResource: number
  grammaticalRange: number
  comments: string
  improvedVersion?: string
  completedAt: string
}

export interface Payment {
  id: string
  userId: string
  essayId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  stripePaymentIntentId: string
  createdAt: string
}