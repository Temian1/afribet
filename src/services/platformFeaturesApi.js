const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function loadPlatformFeatures() {
  const response = await fetch(`${API_BASE}/api/features`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Feature API request failed with HTTP ${response.status}.`)
  }

  return response.json()
}
