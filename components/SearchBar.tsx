'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, FormEvent } from 'react'

interface SearchBarProps {
  initialQuery?: string
  initialFilter?: string
}

export default function SearchBar({ initialQuery = '', initialFilter = '' }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialQuery)
  const [filter, setFilter] = useState(initialFilter)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filter) params.set('filter', filter)
    router.push(`/?${params.toString()}`)
  }

  const handleFilterClick = (filterValue: string) => {
    const newFilter = filter === filterValue ? '' : filterValue
    setFilter(newFilter)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (newFilter) params.set('filter', newFilter)
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, company, or skill..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          type="submit"
          className="bg-primary-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Search
        </button>
      </form>
      
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleFilterClick('internship')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filter === 'internship'
              ? 'bg-primary-blue text-white border-primary-blue'
              : 'bg-white text-gray-700 border-gray-300 hover:border-primary-blue'
          }`}
        >
          Internship
        </button>
        <button
          onClick={() => handleFilterClick('full-time')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filter === 'full-time'
              ? 'bg-primary-blue text-white border-primary-blue'
              : 'bg-white text-gray-700 border-gray-300 hover:border-primary-blue'
          }`}
        >
          Full-Time
        </button>
        <button
          onClick={() => handleFilterClick('remote')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filter === 'remote'
              ? 'bg-primary-blue text-white border-primary-blue'
              : 'bg-white text-gray-700 border-gray-300 hover:border-primary-blue'
          }`}
        >
          Remote
        </button>
      </div>
    </div>
  )
}

