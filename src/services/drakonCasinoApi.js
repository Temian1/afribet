import { apiFetch } from './api'

export async function loadDrakonCasinoGames({
  type = 'all',
  provider = 'all',
  search = '',
  sort = 'popular',
  page = 1,
  perPage = 60,
} = {}) {
  const params = new URLSearchParams({
    type,
    provider,
    search,
    sort,
    page: String(page),
    per_page: String(perPage),
  })

  return apiFetch(`/casino/games?${params.toString()}`, { method: 'GET' })
}

export async function syncDrakonCasinoGames() {
  return apiFetch('/casino/games/sync', {
    method: 'POST',
  })
}

export async function launchDrakonCasinoGame(slug, { demo = true } = {}) {
  return apiFetch(`/casino/games/${slug}/launch`, {
    method: 'POST',
    body: JSON.stringify({ demo }),
  })
}
