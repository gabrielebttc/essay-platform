import React, { useEffect, useState } from 'react'
import { redirectToPayment } from '../services/stripe'
import { essayService, EssaySubmission } from '../services/essay'
import { EssayType } from '../types'

const SubmitEssay: React.FC = () => {
  const [formData, setFormData] = useState<EssaySubmission>({
    taskTypeId: '',
    content: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [selectedEssayType, setSelectedEssayType] = useState<EssayType>(
    { 
      id: '',
      name: '',
      price: 0,
      minWords: 0
    }
  )
  const [essayTypes, setEssayTypes] = useState<EssayType[]>([
      { 
        id: '',
        name: '',
        price: 0,
        minWords: 0
      }
    ]
  )

  useEffect( () => {
    const fetchEssayTypes = async () => {
      try {
          setLoading(true)
          const response = await essayService.getEssayTypes()
          setEssayTypes(response)
        } catch (err: any) {
          setError(err.response?.data?.error || 'Get All Essay Types Failed')
        } finally {
          setLoading(false)
        }
    }

    fetchEssayTypes()
    
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    if(e.target.name == 'taskTypeId') {
      
      // find the id to use to find the selectedEssayType
      const selectedId: string = e.target.value

      const currentTaskType: EssayType | undefined = essayTypes.find(type => type.id === selectedId)

      if (currentTaskType){
        setSelectedEssayType(
          {
            id: currentTaskType.id,
            name: currentTaskType.name,
            price: currentTaskType.price,
            minWords: currentTaskType.minWords,
          }
        )
      }
    }
  }

  const validateEssay = () => {
    const wordCount = formData.content.trim().split(/\s+/).length

    if(selectedEssayType.minWords) {
      if (formData.content.trim().length < selectedEssayType.minWords) {
        setError(`Your essay must be at least ${selectedEssayType.minWords} characters long (current: ${formData.content.trim().length})`)
        return false
      }
      
      if (selectedEssayType.minWords && wordCount < selectedEssayType.minWords) {
        setError(`Your essay should be at least ${selectedEssayType.minWords} words long (current: ${wordCount})`)
        return false
      }
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const isEssayValid = validateEssay()

    if (!isEssayValid) {
      setLoading(false)
      return
    }

    try {
      await redirectToPayment(formData.taskTypeId, formData.content)
      // If redirectToPayment succeeds, user will be redirected to Stripe
      // This code will only execute if there's an error
      setError('Unexpected error during payment redirect')
    } catch (err: any) {
      console.error('Payment redirect error:', err)
      setError(err.message || 'Failed to process payment. Please try again.')
    } finally {
      setLoading(false)
    }
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
              <h1>ERRORREEEEEE:</h1> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 mb-2">
                Task Type
              </label>
              <select
                id="taskTypeId"
                name="taskTypeId"
                value={formData.taskTypeId}
                onChange={handleChange}
                className="form-input"
              >
                <option value="" disabled hidden>Select a Task Type</option>
                { essayTypes.map(essayType => (
                  <option key={essayType.id} value={essayType.id}>{essayType.name} - {essayType.price}</option>
                )) }
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
                Minimum: {selectedEssayType.minWords} | Current: {getWordCount()} words
              </p>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">What you'll get:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li> Overall band score (1-9)</li>
                <li> Individual scores for each IELTS criterion</li>
                <li> Detailed written feedback</li>
                <li> Improved version suggestions (optional)</li>
                <li> 24-48 hour turnaround time</li>
              </ul>
              <div className="mt-3 text-lg font-bold text-blue-600">
                Total: {selectedEssayType.price}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.content.trim()}
              className="btn btn-primary w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Proceed to Payment (${selectedEssayType.price})`}
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