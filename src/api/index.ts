import { BASE_API_URL } from '@/api/constants'

export const fetchErgastData = async (endpoint: string) => {
  const response = await fetch(`${BASE_API_URL}${endpoint}`)
  if (!response.ok) return undefined
  const { MRData } = await response.json()
  return MRData
}
