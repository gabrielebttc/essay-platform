import React, { useState } from 'react'

const SubmitEssay: React.FC = () => {
  const [formData, setFormData] = useState({
    taskType: 'task2' as 'task1' | 'task2',
    content: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // TODO: Implement payment flow first, then submit essay
    setError('Payment integration coming soon. Please contact admin for testing.')

    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Submit Your Essay
          </h1>
          
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
                <option value="task1">IELTS Writing Task 1 (Academic/General)</option>
                <option value="task2">IELTS Writing Task 2 (Essay)</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Essay Content
              </label>
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
              <p className="text-sm text-gray-500 mt-2">
                Minimum word count: Task 1 (150 words), Task 2 (250 words)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitEssay