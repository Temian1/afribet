import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { launchDrakonCasinoGame, loadDrakonCasinoGames } from '../services/drakonCasinoApi';
import { playerApi } from '../services/playerApi';
import { THUMBS } from '../games/thumbnails';
import { SectionHeader, Skeleton } from './ui';

const GAMES = [
    { id: 'slots', name: 'Vegas Blitz', cat: 'Slots', rtp: '96.5%', hot: true },
    { id: 'crash', name: 'Rocket Crash', cat: 'Crash', rtp: '97.0%', hot: true },
    { id: 'mines', name: 'Diamond Mines', cat: 'Mines', rtp: '97.0%', hot: true },
    { id: 'roulette', name: 'Neon Roulette', cat: 'Roulette', rtp: '97.3%', hot: false },
    { id: 'blackjack', name: '21 Inferno', cat: 'Blackjack', rtp: '99.5%', hot: true },
    { id: 'dice', name: 'Hot Dice', cat: 'Dice', rtp: '98.5%', hot: false },
    { id: 'plinko', name: 'Neon Drop', cat: 'Plinko', rtp: '96.0%', hot: false },
    { id: 'limbo', name: 'Limbo', cat: 'Limbo', rtp: '99.0%', hot: false },
    { id: 'wheel', name: 'Fortune Wheel', cat: 'Wheel', rtp: '96.5%', hot: true },
    { id: 'coinflip', name: 'Coin Flip', cat: 'Coinflip', rtp: '98.0%', hot: false },
];

const GAME_BY_ID = Object.fromEntries(GAMES.map((g) => [g.id, g]));

function HeartButton({ active, onToggle, className = '' }) {
    return (
        <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={active}
            className={`z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition hover:scale-110 ${active ? 'bg-neon-red/25 text-neon-red' : 'bg-black/35 text-white/80 hover:text-white'} ${className}`}
        >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
        </button>
    );
}

function OriginalCard({ game, onPlay, favorited, onToggleFavorite, canFavorite }) {
    return (
        <article className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple/20">
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">{THUMBS[game.id]}</div>
            <button
                className="absolute inset-0 z-[1] text-left"
                onClick={() => onPlay(game.id)}
                type="button"
                aria-label={`Play ${game.name}`}
            />
            <div className="pointer-events-none absolute left-0 right-0 top-0 z-[2] flex flex-wrap items-start gap-2 p-3">
                {game.hot && (
                    <span className="badge border border-neon-red/40 bg-neon-red/35 text-red-50 backdrop-blur">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c-4.97 0-8-3.58-8-8 0-3.07 1.64-5.64 3.2-7.53C8.71 5.62 10 4.26 10 2.5c0-.34.28-.55.58-.42C14.05 3.7 20 8.55 20 15c0 4.42-3.03 8-8 8Zm0-3c1.66 0 3-1.34 3-3 0-2.5-3-4.5-3-4.5S9 14.5 9 17c0 1.66 1.34 3 3 3Z" /></svg>
                        Hot
                    </span>
                )}
                {canFavorite && (
                    <span className="pointer-events-auto ml-auto">
                        <HeartButton active={favorited} onToggle={onToggleFavorite} />
                    </span>
                )}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 pt-10">
                <h3 className="font-heading text-sm font-bold text-white">{game.name}</h3>
                <p className="mt-0.5 text-xs text-white/65">{game.cat} · RTP {game.rtp}</p>
            </div>
            <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-ink/70 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                <span className="btn-gold px-5 py-2.5 text-sm uppercase tracking-wider">Play Now</span>
            </div>
        </article>
    );
}

function DrakonCard({ game, onPlay, launching = false, favorited, onToggleFavorite, canFavorite }) {
    return (
        <article className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-purple/40 hover:shadow-xl hover:shadow-purple/15 dark:border-white/10 dark:bg-ink-3">
            <div className="h-full overflow-hidden bg-slate-100 dark:bg-ink">
                {game.image && <img src={game.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
            </div>
            {canFavorite && (
                <div className="absolute right-3 top-3 z-[3]">
                    <HeartButton active={favorited} onToggle={onToggleFavorite} />
                </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 pt-10">
                <div className="mb-2 flex flex-wrap gap-1.5">
                    <span className="badge border border-purple-l/40 bg-purple/25 text-purple-l">{game.type}</span>
                    {game.demo
                        ? <span className="badge border border-gold/40 bg-gold/20 text-gold-l">Demo</span>
                        : <span className="badge border border-emerald-400/40 bg-emerald-500/20 text-emerald-200">Real</span>}
                </div>
                <h3 className="font-heading text-sm font-bold text-white">{game.name}</h3>
                <p className="mt-0.5 text-xs text-white/65">{game.provider || 'Drakon'}{game.rtp ? ` · RTP ${game.rtp}` : ''}</p>
            </div>
            <div className="absolute inset-0 z-[2] flex items-center justify-center bg-ink/70 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                <button
                    className="btn-gold px-5 py-2.5 text-sm uppercase tracking-wider"
                    disabled={launching}
                    onClick={() => onPlay(game.id, game)}
                    type="button"
                >
                    {launching ? 'Loading…' : game.demo ? 'Play Demo' : 'Play Real'}
                </button>
            </div>
        </article>
    );
}

/* Compact horizontal row used for "Recently Played" and "Your Favorites". */
function GameStrip({ title, icon, items, onOpen }) {
    if (!items.length) return null;
    return (
        <div className="mb-12">
            <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[1.5px] text-slate-500">
                {icon}
                {title}
            </h3>
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                {items.map((item) => (
                    <button
                        key={item.game_key}
                        type="button"
                        onClick={() => onOpen(item)}
                        className="card-hover flex min-w-[190px] shrink-0 items-center gap-3 p-3 text-left"
                    >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-purple/12 text-purple dark:text-purple-l">
                            {GAME_BY_ID[item.game_key] && THUMBS[item.game_key]
                                ? <span className="h-full w-full [&>*]:h-full [&>*]:w-full">{THUMBS[item.game_key]}</span>
                                : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6H9a6 6 0 0 0-6 6 4 4 0 0 0 4 4c1 0 2-.5 2.5-1.5L11 13h2l1.5 1.5c.5 1 1.5 1.5 2.5 1.5a4 4 0 0 0 4-4 6 6 0 0 0-6-6Z" /></svg>
                                )}
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{item.game_name || item.game_key}</span>
                            <span className="block text-xs text-slate-500">
                                {item.plays_count ? `${item.plays_count} plays` : item.game_type === 'drakon' ? 'Provider game' : 'Original'}
                            </span>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function DrakonGamesSection({ type, heading, onPlay, launchingGameId = '', favorites, onToggleFavorite, canFavorite }) {
    const [games, setGames] = useState([]);
    const [providers, setProviders] = useState([]);
    const [provider, setProvider] = useState('all');
    const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadGames = useCallback(async (page = 1, append = false) => {
        setLoading(true);
        setError('');

        try {
            const data = await loadDrakonCasinoGames({ type, provider, page, perPage: 24 });
            setGames((current) => append ? [...current, ...(data.games || [])] : (data.games || []));
            setProviders(data.providers || []);
            setMeta(data.meta || { page, pages: 1, total: 0 });
            if (data.sync_error) setError(data.sync_error);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load Drakon games.');
        } finally {
            setLoading(false);
        }
    }, [provider, type]);

    useEffect(() => {
        let mounted = true;

        async function loadInitial() {
            setLoading(true);
            setError('');

            try {
                const data = await loadDrakonCasinoGames({ type, provider, page: 1, perPage: 24 });
                if (!mounted) return;
                setGames(data.games || []);
                setProviders(data.providers || []);
                setMeta(data.meta || { page: 1, pages: 1, total: 0 });
                if (data.sync_error) setError(data.sync_error);
            } catch (err) {
                if (!mounted) return;
                setError(err instanceof Error ? err.message : 'Unable to load Drakon games.');
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadInitial();
        return () => { mounted = false; };
    }, [provider, type]);

    const hasMore = (meta.page || 1) < (meta.pages || 1);

    return (
        <div>
            <SectionHeader
                badge="Provider Games"
                accent={heading.split(' ')[0]}
                title={heading.split(' ').slice(1).join(' ')}
                description={loading && games.length === 0 ? 'Loading provider games…' : `${meta.total || games.length} games available across top providers.`}
            >
                <label className="flex w-full flex-col gap-1 sm:w-64">
                    <span className="field-label mb-0">Provider</span>
                    <select
                        className="input py-2.5 font-semibold"
                        disabled={loading && games.length === 0}
                        onChange={(event) => setProvider(event.target.value)}
                        value={provider}
                    >
                        <option value="all">All Providers</option>
                        {providers.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </label>
            </SectionHeader>

            {error && <p className="mb-6 rounded-xl border border-neon-red/30 bg-neon-red/10 p-3 text-sm font-medium text-neon-red">{error}</p>}

            {!error && (
                <>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                        {loading && games.length === 0
                            ? [...Array(10)].map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />)
                            : games.map((game) => (
                                <DrakonCard
                                    key={game.id}
                                    game={game}
                                    launching={launchingGameId === game.id}
                                    onPlay={onPlay}
                                    canFavorite={canFavorite}
                                    favorited={favorites.has(String(game.id))}
                                    onToggleFavorite={() => onToggleFavorite({ game_key: String(game.id), game_name: game.name, game_type: 'drakon' })}
                                />
                            ))}
                    </div>

                    {hasMore && (
                        <div className="mt-8 flex justify-center">
                            <button
                                className="btn-outline px-7 py-3 text-xs uppercase tracking-wider"
                                disabled={loading}
                                onClick={() => loadGames((meta.page || 1) + 1, true)}
                                type="button"
                            >
                                {loading ? 'Loading…' : 'Load More Games'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function DrakonPlayer({ game, onClose }) {
    if (!game?.url) return null;

    return (
        <div className="fixed inset-0 z-[1700] flex flex-col bg-ink text-white">
            <div className="flex min-h-[64px] items-center justify-between gap-3 border-b border-white/10 bg-black px-4 py-3 sm:px-6">
                <div className="min-w-0">
                    <p className="font-heading text-[10px] font-bold uppercase tracking-[2px] text-gold-l">Playing on NeonBet{game.mode ? ` · ${game.mode}` : ''}</p>
                    <h2 className="truncate font-display text-base font-bold sm:text-lg">{game.name || 'Casino Game'}</h2>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <a
                        className="btn-outline !border-white/20 !text-white px-3 py-2 text-[10px] uppercase tracking-wider"
                        href={game.url}
                        rel="noreferrer"
                        target="_blank"
                    >
                        Open
                    </a>
                    <button
                        className="btn-gold px-3 py-2 text-[10px] uppercase tracking-wider"
                        onClick={onClose}
                        type="button"
                    >
                        Close
                    </button>
                </div>
            </div>
            <iframe
                allow="autoplay; fullscreen; payment"
                className="h-[calc(100vh-64px)] w-full flex-1 border-0 bg-black"
                src={game.url}
                title={game.name || 'Drakon casino game'}
            />
        </div>
    );
}

export default function CasinoSection({ category = 'all', search = '' }) {
    const { setPage, setCurrentGame } = useApp();
    const { user } = useAuth();
    const [activeDrakonGame, setActiveDrakonGame] = useState(null);
    const [launchingGameId, setLaunchingGameId] = useState('');
    const [launchError, setLaunchError] = useState('');
    const [favorites, setFavorites] = useState([]); // [{ game_key, game_name, game_type }]
    const [recent, setRecent] = useState([]);

    const favoriteKeys = useMemo(() => new Set(favorites.map((f) => f.game_key)), [favorites]);

    useEffect(() => {
        if (!user) { setFavorites([]); setRecent([]); return; }
        playerApi.getFavorites().then((d) => setFavorites(d.favorites ?? [])).catch(() => {});
        playerApi.getRecentGames().then((d) => setRecent(d.recent ?? [])).catch(() => {});
    }, [user]);

    const toggleFavorite = async (game) => {
        if (!user) return;
        // Optimistic update
        setFavorites((prev) => prev.some((f) => f.game_key === game.game_key)
            ? prev.filter((f) => f.game_key !== game.game_key)
            : [game, ...prev]);
        try {
            await playerApi.toggleFavorite(game);
        } catch {
            // Revert on failure
            setFavorites((prev) => prev.some((f) => f.game_key === game.game_key)
                ? prev.filter((f) => f.game_key !== game.game_key)
                : [game, ...prev]);
        }
    };

    const trackPlay = (game) => {
        if (!user) return;
        playerApi.trackPlay(game).then(() => {
            setRecent((prev) => {
                const rest = prev.filter((r) => r.game_key !== game.game_key);
                const existing = prev.find((r) => r.game_key === game.game_key);
                return [{ ...game, plays_count: (existing?.plays_count ?? 0) + 1 }, ...rest].slice(0, 12);
            });
        }).catch(() => {});
    };

    const originalGames = useMemo(() => {
        let list = GAMES;
        if (category !== 'all') list = list.filter((game) => game.id === category || game.cat.toLowerCase() === category);
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter((game) => game.name.toLowerCase().includes(q) || game.cat.toLowerCase().includes(q));
        }
        return list;
    }, [category, search]);

    const playOriginal = (id) => {
        trackPlay({ game_key: id, game_name: GAME_BY_ID[id]?.name ?? id, game_type: 'original' });
        setCurrentGame(id);
        setPage('game');
    };

    const playDrakon = async (id, game = null) => {
        setLaunchingGameId(id);
        setLaunchError('');
        trackPlay({ game_key: String(id), game_name: game?.name ?? String(id), game_type: 'drakon' });

        try {
            const demo = game?.demo === true;
            const data = await launchDrakonCasinoGame(id, { demo });
            if (data.url) {
                setActiveDrakonGame({
                    id,
                    url: data.url,
                    name: game?.name,
                    mode: demo ? 'Demo' : 'Real',
                });
            }
        } catch (err) {
            setLaunchError(err instanceof Error ? err.message : 'Unable to launch this casino game.');
        } finally {
            setLaunchingGameId('');
        }
    };

    const openStripItem = (item) => {
        if (item.game_type === 'drakon') {
            playDrakon(item.game_key, { name: item.game_name });
        } else {
            playOriginal(item.game_key);
        }
    };

    const showSlots = category === 'all' || category === 'slots';
    const showLive = category === 'all' || category === 'live';
    const showStrips = category === 'all' && !search.trim() && !!user;

    return (
        <section className="bg-slate-50 py-16 dark:bg-ink">
            <DrakonPlayer game={activeDrakonGame} onClose={() => setActiveDrakonGame(null)} />
            <div className="shell">
                {launchError && <p className="mb-6 rounded-xl border border-neon-red/30 bg-neon-red/10 p-3 text-sm font-medium text-neon-red">{launchError}</p>}

                {showStrips && (
                    <>
                        <GameStrip
                            title="Recently Played"
                            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>}
                            items={recent}
                            onOpen={openStripItem}
                        />
                        <GameStrip
                            title="Your Favorites"
                            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>}
                            items={favorites}
                            onOpen={openStripItem}
                        />
                    </>
                )}

                {originalGames.length > 0 && (
                    <div>
                        <SectionHeader
                            badge="NeonBet Originals"
                            accent="Original"
                            title="games"
                            description="Exclusive in-house games. Provably fair, instant payouts, up to 99.5% RTP."
                        />
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                            {originalGames.map((game) => (
                                <OriginalCard
                                    key={game.id}
                                    game={game}
                                    onPlay={playOriginal}
                                    canFavorite={!!user}
                                    favorited={favoriteKeys.has(game.id)}
                                    onToggleFavorite={() => toggleFavorite({ game_key: game.id, game_name: game.name, game_type: 'original' })}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {(showSlots || showLive) && (
                    <div className={originalGames.length > 0 ? 'mt-16 space-y-16' : 'space-y-16'}>
                        {showSlots && (
                            <DrakonGamesSection
                                type="slots"
                                heading="Slot Games"
                                onPlay={playDrakon}
                                launchingGameId={launchingGameId}
                                favorites={favoriteKeys}
                                onToggleFavorite={toggleFavorite}
                                canFavorite={!!user}
                            />
                        )}
                        {showLive && (
                            <DrakonGamesSection
                                type="live"
                                heading="Live Casino"
                                onPlay={playDrakon}
                                launchingGameId={launchingGameId}
                                favorites={favoriteKeys}
                                onToggleFavorite={toggleFavorite}
                                canFavorite={!!user}
                            />
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
