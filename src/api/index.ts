import { BASE_API_URL } from '@/api/constants'
import { unstable_cache } from 'next/cache'

// Simple fetch wrapper with error handling
const fetchApi = async <T>(endpoint: string): Promise<T | undefined> => {
  try {
    const url = `${BASE_API_URL}${endpoint}`
    const res = await fetch(url)

    if (!res.ok) {
      console.error(`API Error: ${res.status} - ${await res.text()}`)
      return undefined
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error)
    return undefined
  }
}

// Cache wrapper for Ergast API calls
export const fetchErgastData = unstable_cache(
  async <T>(endpoint: string): Promise<T | undefined> => {
    return fetchApi<T>(endpoint)
  },
  ['ergast-data'],
  { revalidate: 3600 } // Cache for 1 hour
)
