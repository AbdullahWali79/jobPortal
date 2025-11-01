import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { JobPost } from '@/types/database'
import { differenceInDays, format } from 'date-fns'
import JobCard from '@/components/JobCard'
import SearchBar from '@/components/SearchBar'

export const revalidate = 60 // Revalidate every minute

async function getJobs(searchQuery?: string, filter?: string): Promise<JobPost[]> {
  let query = supabase
    .from('job_posts')
    .select(`
      *,
      software_house:software_houses(*)
    `)
    .eq('status', 'active')
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,software_houses.name.ilike.%${searchQuery}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching jobs:', error)
    return []
  }

  // Filter by type if provided
  let filteredData = data as any[]
  if (filter) {
    if (filter.toLowerCase() === 'internship') {
      filteredData = filteredData.filter((job: any) => 
        job.title.toLowerCase().includes('intern')
      )
    } else if (filter.toLowerCase() === 'full-time') {
      filteredData = filteredData.filter((job: any) => 
        !job.title.toLowerCase().includes('intern')
      )
    }
  }

  return filteredData as JobPost[]
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string; filter?: string }
}) {
  const jobs = await getJobs(searchParams.search, searchParams.filter)

  return (
    <div className="min-h-screen">
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
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-primary-blue">Home</Link>
              <Link href="/#jobs" className="text-gray-700 hover:text-primary-blue">Jobs</Link>
              <Link href="/#internships" className="text-gray-700 hover:text-primary-blue">Internships</Link>
              <Link href="/softwarehouse" className="text-gray-700 hover:text-primary-blue">Post a Job</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Find the Latest Internships & Jobs
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connecting top talent with exciting opportunities. Your next career move starts here.
          </p>
          
          <SearchBar initialQuery={searchParams.search} initialFilter={searchParams.filter} />
        </div>

        {/* Featured Listings */}
        <div id="jobs" className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Listings</h2>
          
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No jobs found. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">J</span>
                </div>
                <span className="text-xl font-bold text-primary-blue">InternHub</span>
              </div>
              <p className="text-gray-600">
                Your one-stop platform for discovering career opportunities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <p className="text-gray-600">contact@internhub.com</p>
              <p className="text-gray-600">+1 (234) 567-890</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/softwarehouse" className="block text-gray-600 hover:text-primary-blue">Post a Job</Link>
                <Link href="/admin" className="block text-gray-600 hover:text-primary-blue">Admin Portal</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>© 2024 InternHub Portal. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

