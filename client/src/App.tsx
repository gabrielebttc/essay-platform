import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { authService } from './services/auth'
import { User } from './types'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SubmitEssay from './pages/SubmitEssay'
import EssayList from './pages/EssayList'
import EssayDetail from './pages/EssayDetail'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSubmissions from './pages/admin/AdminSubmissions'
import AdminEssayDetail from './pages/admin/AdminEssayDetail'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        } catch (error) {
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = (userData: User, token: string) => {
    setUser(userData)
    localStorage.setItem('token', token)
  }

  const logout = () => {
    setUser(null)
    authService.logout()
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar user={user} onLogout={logout} />}
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={login} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register onLogin={login} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/submit" 
          element={user ? <SubmitEssay /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/essays" 
          element={user ? <EssayList /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/essays/:id" 
          element={user ? <EssayDetail /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/payment/success" 
          element={user ? <PaymentSuccess /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/payment/cancel" 
          element={user ? <PaymentCancel /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/submissions" 
          element={user?.role === 'admin' ? <AdminSubmissions /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/submissions/:id" 
          element={user?.role === 'admin' ? <AdminEssayDetail /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  )
}

export default App