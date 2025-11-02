'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  // Default admin password - CHANGE THIS IN PRODUCTION!
  // In production, store this in environment variable and use proper auth
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

  // Check if already logged in on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('admin_logged_in')
      const loginTime = localStorage.getItem('admin_login_time')
      
      if (loggedIn === 'true' && loginTime) {
        const loginDate = new Date(loginTime)
        const now = new Date()
        const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)
        
        // If session is still valid (less than 24 hours), redirect to dashboard
        if (hoursDiff < 24) {
          router.replace('/admin')
          return
        } else {
          // Session expired - clear it
          localStorage.removeItem('admin_logged_in')
          localStorage.removeItem('admin_login_time')
        }
      }
      setChecking(false)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple password check (for demo only - use proper auth in production)
    if (password === ADMIN_PASSWORD) {
      // Store login session
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_logged_in', 'true')
        localStorage.setItem('admin_login_time', new Date().toISOString())
      }
      // Redirect to admin dashboard
      router.replace('/admin')
    } else {
      setError('Invalid password. Please try again.')
      setPassword('')
      setLoading(false)
    }
  }

  // Show loading while checking authentication
  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-2">Checking authentication...</div>
          <div className="text-gray-400 text-sm">Please wait</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-center mb-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <span className="text-2xl font-bold text-primary-blue">InternHub Admin</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-600 mb-6">Enter your password to access the admin dashboard.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !password || checking}
              className="w-full bg-primary-blue text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Default password: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              Change this by setting <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_ADMIN_PASSWORD</code> in Vercel
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-primary-blue hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

