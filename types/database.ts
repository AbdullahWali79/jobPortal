export type SoftwareHouseStatus = 'pending' | 'approved' | 'rejected'
export type JobPostStatus = 'active' | 'expired' | 'hidden'

export interface SoftwareHouse {
  id: string
  name: string
  phone: string
  display_phone: string
  website: string
  status: SoftwareHouseStatus
  created_at: string
}

export interface JobPost {
  id: string
  software_house_id: string
  title: string
  image_url: string
  youtube_url: string | null
  contact_info: string
  status: JobPostStatus
  created_at: string
  expires_at: string
  software_house?: SoftwareHouse
}

