import { BASE_API_URL } from '@/api/constants'
import { unstable_cache } from 'next/cache'

// Simple fetch wrapper with error handling
const fetchApi = async <T>(endpoint: string): Promise<T | undefined> => {
  try {
    const url = `${BASE_API_URL}${endpoint}`
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 },
      cache: 'force-cache' as RequestCache
    }

    const res = await fetch(url, options)
    if (!res.ok) return undefined

    const data = await res.json()
    if (!data?.MRData) return undefined

    return data
  } catch (error) {
    return undefined
  }
}

// Cache wrapper for Ergast API calls
export const fetchErgastData = unstable_cache(
  async <T>(endpoint: string): Promise<T | undefined> => fetchApi<T>(endpoint),
  ['ergast-data'],
  { revalidate: 3600 }
)
