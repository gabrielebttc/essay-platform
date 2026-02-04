import React from 'react'
import { User } from '../types'

interface DashboardProps {
  user: User
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome back, {user.name}!
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Submit New Essay
                </h3>
                <p className="text-gray-600 mb-4">
                  Submit your IELTS Task 1 or Task 2 essay for detailed feedback.
                </p>
                <a
                  href="/submit"
                  className="btn btn-primary inline-block"
                >
                  Submit Essay
                </a>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  View My Essays
                </h3>
                <p className="text-gray-600 mb-4">
                  Check the status of your submissions and view feedback.
                </p>
                <a
                  href="/essays"
                  className="btn btn-secondary inline-block"
                >
                  View Essays
                </a>
              </div>
              
              {user.targetBandScore && (
                <div className="card">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Target Band Score
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {user.targetBandScore}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Your IELTS target score
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard