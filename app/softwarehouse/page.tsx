'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { SoftwareHouse, JobPost } from '@/types/database'
import { format } from 'date-fns'
import Link from 'next/link'

export default function SoftwareHousePage() {
  const [house, setHouse] = useState<SoftwareHouse | null>(null)
  const [jobs, setJobs] = useState<JobPost[]>([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [posting, setPosting] = useState(false)
  
  // Registration form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    display_phone: '',
    website: ''
  })
  
  // Job posting form
  const [jobForm, setJobForm] = useState({
    title: '',
    image_url: '',
    youtube_url: '',
    contact_info: ''
  })

  useEffect(() => {
    checkExistingHouse()
  }, [])

  const checkExistingHouse = async () => {
    try {
      // In a real app, you'd get this from auth session
      // For now, we'll check localStorage or allow manual entry
      if (typeof window !== 'undefined') {
        const storedHouseId = localStorage.getItem('software_house_id')
        
        if (storedHouseId) {
          const { data: houseData } = await supabase
            .from('software_houses')
            .select('*')
            .eq('id', storedHouseId)
            .single()
          
          if (houseData) {
            setHouse(houseData as SoftwareHouse)
            loadJobs(storedHouseId)
          } else {
            localStorage.removeItem('software_house_id')
          }
        }
      }
    } catch (error) {
      console.error('Error checking house:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadJobs = async (houseId: string) => {
    const { data, error } = await supabase
      .from('job_posts')
      .select('*')
      .eq('software_house_id', houseId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setJobs(data as JobPost[])
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistering(true)

    try {
      const { data, error } = await supabase
        .from('software_houses')
        .insert([{
          ...formData,
          status: 'pending'
        }])
        .select()
        .single()

      if (error) throw error

      setHouse(data as SoftwareHouse)
      if (typeof window !== 'undefined') {
        localStorage.setItem('software_house_id', data.id)
      }
      alert('Registration submitted! Waiting for admin approval.')
      setFormData({ name: '', phone: '', display_phone: '', website: '' })
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setRegistering(false)
    }
  }

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!house || house.status !== 'approved') {
      alert('Your software house must be approved before posting jobs.')
      return
    }

    setPosting(true)

    try {
      const defaultDays = parseInt(process.env.NEXT_PUBLIC_DEFAULT_JOB_DISPLAY_DAYS || '5')
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + defaultDays)

      const { error } = await supabase
        .from('job_posts')
        .insert([{
          ...jobForm,
          software_house_id: house.id,
          status: 'active',
          expires_at: expiresAt.toISOString()
        }])

      if (error) throw error

      alert('Job posted successfully!')
      setJobForm({ title: '', image_url: '', youtube_url: '', contact_info: '' })
      loadJobs(house.id)
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setPosting(false)
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

      if (house) loadJobs(house.id)
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
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
              <span className="text-2xl font-bold text-primary-blue">InternHub</span>
            </Link>
            <Link href="/" className="text-primary-blue hover:underline">Back to Home</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!house ? (
          /* Registration Form */
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Register Your Software House</h1>
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Phone *
                </label>
                <input
                  type="text"
                  required
                  value={formData.display_phone}
                  onChange={(e) => setFormData({ ...formData, display_phone: e.target.value })}
                  placeholder="e.g., +1 (234) 567-890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website *
                </label>
                <input
                  type="url"
                  required
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={registering}
                className="w-full bg-primary-blue text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {registering ? 'Submitting...' : 'Submit Registration'}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-gray-900">{house.name}</h2>
                    {house.status === 'approved' && (
                      <div className="flex items-center gap-2">
                        <svg className="w-6 h-6 text-primary-blue" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-primary-blue font-semibold">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      house.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : house.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {house.status.charAt(0).toUpperCase() + house.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">{house.website}</p>
                  <p className="text-gray-600">{house.display_phone}</p>
                </div>
              </div>
            </div>

            {house.status === 'approved' ? (
              <>
                {/* Job Posting Form */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a New Job Posting</h2>
                  <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={jobForm.title}
                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                        placeholder="e.g., Senior Frontend Developer"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={jobForm.image_url}
                        onChange={(e) => setJobForm({ ...jobForm, image_url: e.target.value })}
                        placeholder="https://source.unsplash.com/random"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        YouTube Video URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={jobForm.youtube_url}
                        onChange={(e) => setJobForm({ ...jobForm, youtube_url: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Info *
                      </label>
                      <input
                        type="email"
                        required
                        value={jobForm.contact_info}
                        onChange={(e) => setJobForm({ ...jobForm, contact_info: e.target.value })}
                        placeholder="e.g., hr@company.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        disabled={posting}
                        className="bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {posting ? 'Posting...' : 'Submit Job Post'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* My Job Postings */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Job Postings</h2>
                  {jobs.length === 0 ? (
                    <p className="text-gray-600">No job postings yet. Create your first one above!</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {jobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                          <div className="relative h-48 bg-gray-200">
                            {job.image_url ? (
                              <img src={job.image_url} alt={job.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-blue to-primary-orange">
                                <span className="text-white text-2xl font-bold">{house.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h3>
                            <p className="text-gray-600 mb-2">{house.name}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                              job.status === 'active' && new Date(job.expires_at) > new Date()
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status === 'active' && new Date(job.expires_at) > new Date() ? 'Active' : 'Expired'}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">
                  Your registration is {house.status}. Please wait for admin approval before posting jobs.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

