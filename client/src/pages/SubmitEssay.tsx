import React, { useState } from 'react'
import { redirectToCheckout } from '../services/stripe'
import { EssaySubmission } from '../services/essay'

const SubmitEssay: React.FC = () => {
  const [formData, setFormData] = useState<EssaySubmission>({
    taskType: 'task2',
    content: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [currentWordsCount, setCurrentWordsCount] = useState<Number>(0)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    if(e.target.name == 'content') {
      setCurrentWordsCount(getWordCount())
    }
  }

  const validateEssay = () => {
    const minLength = formData.taskType === 'task1' ? 150 : 250
    const wordCount = formData.content.trim().split(/\s+/).length
    
    if (formData.content.trim().length < minLength) {
      setError(`Your essay must be at least ${minLength} characters long (current: ${formData.content.trim().length})`)
      return false
    }
    
    if (wordCount < (formData.taskType === 'task1' ? 150 : 250)) {
      setError(`Your essay should be at least ${formData.taskType === 'task1' ? 150 : 250} words long (current: ${wordCount})`)
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!validateEssay()) {
      setLoading(false)
      return
    }

    try {
      await redirectToCheckout(formData.taskType, formData.content)
      // If redirectToCheckout succeeds, user will be redirected to Stripe
      // This code will only execute if there's an error
      setError('Unexpected error during payment redirect')
    } catch (err: any) {
      console.error('Payment redirect error:', err)
      setError(err.message || 'Failed to process payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getPrice = () => {
    return formData.taskType === 'task1' ? '$20.00' : '$25.00'
  }

  const getWordCount = () => {
    if (!formData.content.trim()) return 0
    return formData.content.trim().split(/\s+/).length
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Submit Your Essay
          </h1>
          <p className="text-gray-600 mb-6">
            Get professional feedback on your IELTS essay from experienced examiners
          </p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 mb-2">
                Task Type
              </label>
              <select
                id="taskType"
                name="taskType"
                value={formData.taskType}
                onChange={handleChange}
                className="form-input"
              >
                <option value="task1">IELTS Writing Task 1 (Academic/General) - {getPrice()}</option>
                <option value="task2">IELTS Writing Task 2 (Essay) - {getPrice()}</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Essay Content
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  name="content"
                  rows={15}
                  required
                  className="form-input"
                  placeholder="Paste your essay here or type it directly..."
                  value={formData.content}
                  onChange={handleChange}
                />
                <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-sm text-gray-500">
                  {getWordCount()} words
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Minimum: {formData.taskType === 'task1' ? '150 words' : '250 words'} | Current: {String(currentWordsCount)} words
              </p>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">What you'll get:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Overall band score (1-9)</li>
                <li>• Individual scores for each IELTS criterion</li>
                <li>• Detailed written feedback</li>
                <li>• Improved version suggestions (optional)</li>
                <li>• 24-48 hour turnaround time</li>
              </ul>
              <div className="mt-3 text-lg font-bold text-blue-600">
                Total: {getPrice()}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.content.trim()}
              className="btn btn-primary w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Proceed to Payment (${getPrice()})`}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              By submitting, you agree to our terms of service. You'll be redirected to Stripe for secure payment processing.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitEssay