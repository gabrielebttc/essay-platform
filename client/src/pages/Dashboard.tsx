import React from 'react'
import { User } from '../types'
import { Link } from 'react-router-dom'

interface DashboardProps {
  user: User
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Submit New Essay
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Submit your IELTS Task 1 or Task 2 essay for detailed feedback.
                  </p>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <Link
                    to="/submit"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Submit Essay &rarr;
                  </Link>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    View My Essays
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Check the status of your submissions and view feedback.
                  </p>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <Link
                    to="/essays"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View Essays &rarr;
                  </Link>
                </div>
              </div>

              {user.targetBandScore && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-gray-900">
                      Target Band Score
                    </h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {user.targetBandScore}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Your IELTS target score
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Dashboard
