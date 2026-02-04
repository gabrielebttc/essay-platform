import React from 'react'
import { Link } from 'react-router-dom'
import { User } from '../types'

interface NavbarProps {
  user: User
  onLogout: () => void
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-blue-600">
              IELTS Essay Feedback
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user.role === 'student' && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/submit" className="text-gray-600 hover:text-gray-900">
                  Submit Essay
                </Link>
                <Link to="/essays" className="text-gray-600 hover:text-gray-900">
                  My Essays
                </Link>
              </>
            )}
            
            {user.role === 'admin' && (
              <Link to="/admin/submissions" className="text-gray-600 hover:text-gray-900">
                Admin Panel
              </Link>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">{user.name}</span>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar