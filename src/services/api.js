const API_BASE = import.meta.env.VITE_API_BASE || ''

const TOKEN_KEY = 'nb_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export async function apiFetch(path, options = {}) {
    const token = getToken()
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    }

    const res = await fetch(`${API_BASE}/api${path}`, {
        ...options,
        headers,
    })

    if (res.status === 204) return null

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
        const err = new Error(data.message || `HTTP ${res.status}`)
        err.status = res.status
        err.data = data
        err.errors = data.errors || {}
        throw err
    }

    return data
}

export const api = {
    get: (path) => apiFetch(path, { method: 'GET' }),
    post: (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
    put: (path, body) => apiFetch(path, { method: 'PUT', body: JSON.stringify(body) }),
    patch: (path, body) => apiFetch(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (path) => apiFetch(path, { method: 'DELETE' }),
}

export default api
