import api from './api'

// Favorites & recently played games
export const playerApi = {
    getFavorites: () => api.get('/player/favorites'),
    toggleFavorite: (data) => api.post('/player/favorites/toggle', data),
    getRecentGames: () => api.get('/player/recent-games'),
    trackPlay: (data) => api.post('/player/recent-games', data),
}

// Public live winners feed
export const winnersApi = {
    getRecent: () => api.get('/winners/recent'),
}

// Account security & responsible gambling
export const accountApi = {
    getSessions: () => api.get('/user/sessions'),
    revokeSession: (id) => api.delete(`/user/sessions/${id}`),
    getLimits: () => api.get('/user/limits'),
    updateLimits: (data) => api.put('/user/limits', data),
    getKyc: () => api.get('/user/kyc'),
    submitKyc: (data) => api.post('/user/kyc', data),
}

export default playerApi
