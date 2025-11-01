'use client'

import { JobPost } from '@/types/database'
import { differenceInDays } from 'date-fns'
import Link from 'next/link'

interface JobCardProps {
  job: JobPost
}

export default function JobCard({ job }: JobCardProps) {
  const daysLeft = differenceInDays(new Date(job.expires_at), new Date())
  const companyName = job.software_house?.name || 'Unknown Company'

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Days Left Badge */}
      <div className="flex justify-end p-2">
        <span className="bg-primary-orange text-white px-3 py-1 rounded-full text-sm font-medium">
          {daysLeft > 0 ? `${daysLeft} Days Left` : 'Expiring Soon'}
        </span>
      </div>

      {/* Company Image */}
      <div className="relative w-full h-48 bg-gray-200">
        {job.image_url ? (
          <img
            src={job.image_url}
            alt={job.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-blue to-primary-orange">
                    <span class="text-white text-2xl font-bold">${companyName.charAt(0)}</span>
                  </div>
                `
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-blue to-primary-orange">
            <span className="text-white text-2xl font-bold">
              {companyName.charAt(0)}
            </span>
          </div>
        )}
        
        {/* YouTube Icon Overlay */}
        {job.youtube_url && (
          <div className="absolute top-2 left-2 bg-red-600 rounded-full p-2">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Job Info */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h3>
        <p className="text-gray-600 mb-4">{companyName}</p>
        
        <div className="mt-auto">
          <Link
            href={`mailto:${job.contact_info}?subject=Application for ${job.title}`}
            className="block w-full bg-primary-blue text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Contact Now
          </Link>
        </div>
      </div>
    </div>
  )
}

