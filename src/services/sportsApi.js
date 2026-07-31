import api from './api'

export const sportsApi = {
    getLeagues: (params = {}) => {
        const qs = new URLSearchParams(params).toString()
        return api.get(`/sports/leagues${qs ? '?' + qs : ''}`)
    },
    getTodayEvents: () => api.get('/sports/events/today'),
    getUpcomingEvents: (params = {}) => {
        const qs = new URLSearchParams(params).toString()
        return api.get(`/sports/events/upcoming${qs ? '?' + qs : ''}`)
    },
    getLiveEvents: () => api.get('/sports/events/live'),
    getEvent: (id) => api.get(`/sports/events/${id}`),
    getEventMarkets: (id) => api.get(`/sports/events/${id}/markets`),
    getLeagueEvents: (id, params = {}) => {
        const qs = new URLSearchParams(params).toString()
        return api.get(`/sports/leagues/${id}/events${qs ? '?' + qs : ''}`)
    },
    getTeam: (id) => api.get(`/sports/teams/${id}`),
    getPlayer: (id) => api.get(`/sports/players/${id}`),
    placeBet: (data) => api.post('/sports/bets', data),
    placeMultiBet: (data) => api.post('/sports/bets/multi', data),
    cashoutBet: (id) => api.post(`/sports/bets/${id}/cashout`, {}),
    getMyBets: (params = {}) => {
        const qs = new URLSearchParams(params).toString()
        return api.get(`/sports/bets${qs ? '?' + qs : ''}`)
    },
}

export default sportsApi
