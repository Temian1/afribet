import api from './api'

// Server-authoritative original games. The backend computes every outcome
// from provably-fair seeds; the UI only animates the result.
export const originalsApi = {
    // One-shot games: dice, limbo, coinflip, wheel, roulette, slots, plinko, dice3d
    play: (game, stake, params = {}) => api.post('/originals/play', { game, stake, params }),

    // Interactive games
    crashStart: (stake) => api.post('/originals/crash/start', { stake }),
    crashCashout: (roundId) => api.post(`/originals/crash/${roundId}/cashout`, {}),
    crashResolve: (roundId) => api.post(`/originals/crash/${roundId}/resolve`, {}),

    minesStart: (stake, mines) => api.post('/originals/mines/start', { stake, mines }),
    minesReveal: (roundId, tile) => api.post(`/originals/mines/${roundId}/reveal`, { tile }),
    minesCashout: (roundId) => api.post(`/originals/mines/${roundId}/cashout`, {}),

    blackjackStart: (stake) => api.post('/originals/blackjack/start', { stake }),
    blackjackAction: (roundId, action) => api.post(`/originals/blackjack/${roundId}/action`, { action }),

    // Provably fair
    getSeeds: () => api.get('/originals/seeds'),
    rotateSeeds: (clientSeed) => api.post('/originals/seeds', { client_seed: clientSeed }),
    getHistory: (page = 1) => api.get(`/originals/history?page=${page}`),
}

export default originalsApi
