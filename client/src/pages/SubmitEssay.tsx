import React, { useEffect, useState } from 'react'
import { redirectToPayment } from '../services/stripe'
import { essayService, EssaySubmission } from '../services/essay'
import { EssayType } from '../types'
import { CheckCircle } from 'lucide-react'

const SubmitEssay: React.FC = () => {
  const [formData, setFormData] = useState<EssaySubmission>({
    taskTypeId: '',
    content: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [selectedEssayType, setSelectedEssayType] = useState<EssayType | null>(null)
  const [essayTypes, setEssayTypes] = useState<EssayType[]>([])

  useEffect(() => {
    const fetchEssayTypes = async () => {
      try {
        setLoading(true)
        const response = await essayService.getEssayTypes()
        setEssayTypes(response)
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch essay types')
      } finally {
        setLoading(false)
      }
    }
    fetchEssayTypes()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'taskTypeId') {
      const currentTaskType = essayTypes.find(type => type.id === value)
      setSelectedEssayType(currentTaskType || null)
    }
  }

  const validateEssay = () => {
    if (!selectedEssayType) {
      setError('Please select an essay type.')
      return false
    }
    const wordCount = getWordCount()
    if (selectedEssayType.minWords !== null && wordCount < selectedEssayType.minWords) {
      setError(`Your essay must be at least ${selectedEssayType.minWords} words long (current: ${wordCount})`)
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEssay()) return

    setLoading(true)
    try {
      await redirectToPayment(formData.taskTypeId, formData.content)
    } catch (err: any) {
      console.error('Payment redirect error:', err)
      setError(err.message || 'Failed to process payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getWordCount = () => {
    return formData.content.trim().split(/\s+/).filter(Boolean).length
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Submit Your Essay
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Get professional feedback on your IELTS essay from experienced examiners
          </p>
        </div>

        {error && (
          <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <label htmlFor="taskTypeId" className="block text-sm font-medium text-gray-700">
                1. Select Task Type
              </label>
              <select
                id="taskTypeId"
                name="taskTypeId"
                value={formData.taskTypeId}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="" disabled>Select a Task Type</option>
                {essayTypes.map(essayType => (
                  <option key={essayType.id} value={essayType.id}>
                    {essayType.name} - ${parseFloat(essayType.price).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                2. Paste Your Essay Content
              </label>
              <div className="mt-1 relative">
                <textarea
                  id="content"
                  name="content"
                  rows={15}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Paste your essay here or type it directly..."
                  value={formData.content}
                  onChange={handleChange}
                />
                <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                  {getWordCount()} words
                </div>
              </div>
              {selectedEssayType && (
                <p className="mt-2 text-sm text-gray-500">
                  Minimum: {selectedEssayType.minWords} words | Current: {getWordCount()} words
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-6">
              <h3 className="text-lg font-medium text-gray-900">What you'll get:</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start"><CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mr-2 mt-0.5" /> Overall band score (1-9)</li>
                <li className="flex items-start"><CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mr-2 mt-0.5" /> Individual scores for each IELTS criterion</li>
                <li className="flex items-start"><CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mr-2 mt-0.5" /> Detailed written feedback</li>
                <li className="flex items-start"><CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mr-2 mt-0.5" /> 24-48 hour turnaround time</li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg font-medium text-gray-900">
                  <span>Total:</span>
                  <span>${selectedEssayType && selectedEssayType.price !== null ? parseFloat(selectedEssayType.price).toFixed(2) : '0.00'}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.content.trim() || !selectedEssayType}
                className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Proceed to Payment`}
              </button>

              <p className="mt-4 text-xs text-gray-500 text-center">
                By submitting, you agree to our terms of service. You'll be redirected to Stripe for secure payment processing.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubmitEssay
