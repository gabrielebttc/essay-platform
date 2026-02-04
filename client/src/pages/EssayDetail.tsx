import React from 'react'
import { useParams } from 'react-router-dom'

const EssayDetail: React.FC = () => {
  const { id } = useParams()

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Essay Details
          </h1>
          <p className="text-gray-600">
            Essay detail functionality will be implemented after the payment system.
          </p>
          <p className="text-sm text-gray-500 mt-2">Essay ID: {id}</p>
        </div>
      </div>
    </div>
  )
}

export default EssayDetail