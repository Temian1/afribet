import api from './api'

// Auth
export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout', {}),
    me: () => api.get('/auth/me'),
}

// User profile
export const userApi = {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
    changePassword: (data) => api.put('/user/password', data),
    getReferrals: () => api.get('/user/referrals'),
}

// Wallet
export const walletApi = {
    getSummary: () => api.get('/wallet/summary'),
    getTransactions: (page = 1) => api.get(`/wallet/transactions?page=${page}`),
    deposit: (data) => api.post('/wallet/deposit', data),
    withdraw: (data) => api.post('/wallet/withdraw', data),
}

export default { authApi, userApi, walletApi }
