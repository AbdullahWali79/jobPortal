'use client'

import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { SoftwareHouse, JobPost } from '@/types/database'
import { format } from 'date-fns'
import Link from 'next/link'

export default function AdminPage() {
  const [pendingHouses, setPendingHouses] = useState<SoftwareHouse[]>([])
  const [activeJobs, setActiveJobs] = useState<JobPost[]>([])
  const [expiredJobs, setExpiredJobs] = useState<JobPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [defaultDays, setDefaultDays] = useState(5)
  const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active')

  useEffect(() => {
    // Check Supabase configuration first
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please check your environment variables in Vercel Dashboard. Go to Settings → Environment Variables and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.')
      setLoading(false)
      return
    }
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setError(null)
      
      if (!isSupabaseConfigured() || !supabase) {
        setError('Supabase is not configured. Please check your environment variables in Vercel Dashboard. Go to Settings → Environment Variables and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.')
        setLoading(false)
        return
      }
      
      // Load pending houses
      const { data: housesData, error: housesError } = await supabase
        .from('software_houses')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (housesError) {
        console.error('Error loading pending houses:', housesError)
        setError(housesError.message || 'Failed to load pending software houses. Check if database tables exist.')
      } else if (housesData) {
        setPendingHouses(housesData as SoftwareHouse[])
      }

      // Load active jobs
      const { data: activeJobsData, error: activeJobsError } = await supabase
        .from('job_posts')
        .select(`
          *,
          software_house:software_houses(*)
        `)
        .neq('status', 'hidden')
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })

      if (activeJobsError) {
        console.error('Error loading active jobs:', activeJobsError)
        if (!error) setError('Failed to load active jobs')
      } else if (activeJobsData) {
        setActiveJobs(activeJobsData as JobPost[])
      }

      // Load expired jobs
      const { data: expiredJobsData, error: expiredJobsError } = await supabase
        .from('job_posts')
        .select(`
          *,
          software_house:software_houses(*)
        `)
        .neq('status', 'hidden')
        .lt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })

      if (expiredJobsError) {
        console.error('Error loading expired jobs:', expiredJobsError)
        if (!error) setError('Failed to load expired jobs')
      } else if (expiredJobsData) {
        setExpiredJobs(expiredJobsData as JobPost[])
      }

      // Load default days setting (stored in localStorage for demo)
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('default_job_days')
        if (stored) setDefaultDays(parseInt(stored))
      }
    } catch (error: any) {
      console.error('Error loading data:', error)
      setError(error.message || 'An unexpected error occurred. Please check your browser console.')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveHouse = async (houseId: string) => {
    try {
      const { error } = await supabase
        .from('software_houses')
        .update({ status: 'approved' })
        .eq('id', houseId)

      if (error) throw error
      loadData()
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
  }

  const handleRejectHouse = async (houseId: string) => {
    if (!confirm('Are you sure you want to reject this software house?')) return

    try {
      const { error } = await supabase
        .from('software_houses')
        .update({ status: 'rejected' })
        .eq('id', houseId)

      if (error) throw error
      loadData()
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
  }

  const handleHideJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('job_posts')
        .update({ status: 'hidden' })
        .eq('id', jobId)

      if (error) throw error
      loadData()
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
  }

  const handleExtendJob = async (jobId: string) => {
    try {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + defaultDays)

      const { error } = await supabase
        .from('job_posts')
        .update({ 
          expires_at: expiresAt.toISOString(),
          status: 'active'
        })
        .eq('id', jobId)

      if (error) throw error
      loadData()
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job post?')) return

    try {
      const { error } = await supabase
        .from('job_posts')
        .delete()
        .eq('id', jobId)

      if (error) throw error
      loadData()
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
  }

  const handleSaveDefaultDays = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('default_job_days', defaultDays.toString())
    }
    alert('Default days saved!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-2">Loading Admin Panel...</div>
          <div className="text-gray-400 text-sm">Please wait</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-bold text-lg mb-2">Error Loading Admin Panel</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">Possible causes:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>Supabase connection issue</li>
                <li>Database tables not created</li>
                <li>RLS policies blocking access</li>
              </ul>
            </div>
            <button
              onClick={() => {
                setError(null)
                setLoading(true)
                loadData()
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors mr-2"
            >
              Try Again
            </button>
            <a
              href="/"
              className="inline-block bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <span className="text-2xl font-bold text-primary-blue">InternHub Admin</span>
            </Link>
            <Link href="/" className="text-primary-blue hover:underline">Back to Home</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pending Software Houses */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Software Houses</h2>
          <p className="text-gray-600 mb-6">Review and approve new software houses waiting to join the portal.</p>
          
          {pendingHouses.length === 0 ? (
            <p className="text-gray-500">No pending software houses.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Company Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Submitted On</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingHouses.map((house) => (
                    <tr key={house.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{house.name}</td>
                      <td className="py-3 px-4">{format(new Date(house.created_at), 'MMM dd, yyyy')}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveHouse(house.id)}
                            className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectHouse(house.id)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Job Posts */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Posts</h2>
          <p className="text-gray-600 mb-6">Manage all active and expired job postings on the platform.</p>
          
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('active')}
              className={`pb-2 px-4 font-medium ${
                activeTab === 'active'
                  ? 'border-b-2 border-primary-blue text-primary-blue'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`pb-2 px-4 font-medium ${
                activeTab === 'expired'
                  ? 'border-b-2 border-primary-blue text-primary-blue'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Expired
            </button>
          </div>

          {activeTab === 'active' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Job Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Expires</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeJobs.map((job) => (
                    <tr key={job.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{job.title}</td>
                      <td className="py-3 px-4">{(job.software_house as any)?.name || 'Unknown'}</td>
                      <td className="py-3 px-4">{format(new Date(job.created_at), 'MMM dd, yyyy')}</td>
                      <td className="py-3 px-4">{format(new Date(job.expires_at), 'MMM dd, yyyy')}</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleExtendJob(job.id)}
                            className="bg-primary-orange text-white px-3 py-1 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                            title="Extend"
                          >
                            ⏱️
                          </button>
                          <button
                            onClick={() => handleHideJob(job.id)}
                            className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                            title="Hide"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-sm"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {activeJobs.length === 0 && (
                <p className="text-gray-500 py-4">No active job posts.</p>
              )}
            </div>
          )}

          {activeTab === 'expired' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Job Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Expired</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expiredJobs.map((job) => (
                    <tr key={job.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{job.title}</td>
                      <td className="py-3 px-4">{(job.software_house as any)?.name || 'Unknown'}</td>
                      <td className="py-3 px-4">{format(new Date(job.created_at), 'MMM dd, yyyy')}</td>
                      <td className="py-3 px-4">{format(new Date(job.expires_at), 'MMM dd, yyyy')}</td>
                      <td className="py-3 px-4">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                          Expired
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleExtendJob(job.id)}
                            className="bg-primary-orange text-white px-3 py-1 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                            title="Relist"
                          >
                            Relist
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-sm"
                            title="Delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {expiredJobs.length === 0 && (
                <p className="text-gray-500 py-4">No expired job posts.</p>
              )}
            </div>
          )}
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">General Settings</h2>
          <p className="text-gray-600 mb-6">Configure default settings for the platform.</p>
          
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Job Post Display Days
            </label>
            <input
              type="number"
              min="1"
              value={defaultDays}
              onChange={(e) => setDefaultDays(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent mb-2"
            />
            <p className="text-sm text-gray-500 mb-4">
              This will be the default duration for all new job posts.
            </p>
            <button
              onClick={handleSaveDefaultDays}
              className="bg-primary-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

