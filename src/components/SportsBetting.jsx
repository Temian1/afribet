import { useState, useEffect, useCallback } from "react";
import sportsApi from "../services/sportsApi";
import { useBetSlip } from "../contexts/BetSlipContext";
import { SectionHeader, Skeleton, EmptyState } from "./ui";

function OddsButton({ label, odd, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group/odd rounded-xl border px-3 py-2.5 transition-all duration-200 ${
        selected
          ? "border-gold bg-gradient-to-b from-gold/20 to-gold/10 text-amber-700 shadow-md shadow-gold/15 dark:text-gold-l"
          : "border-[var(--pf-border)] bg-slate-50 text-slate-600 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md dark:bg-white/[.04] dark:text-slate-300"
      }`}
    >
      <span className="block text-[10px] font-bold uppercase tracking-wide opacity-70">{label}</span>
      <strong className="font-display text-sm tabular-nums">{odd?.toFixed(2) ?? "—"}</strong>
    </button>
  );
}

function MatchCard({ event }) {
  const { toggle, has } = useBetSlip();
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    sportsApi.getEventMarkets(event.id)
      .then((d) => setMarkets(d.markets ?? d))
      .catch(() => setMarkets([]));
  }, [event.id]);

  const isLive = event.status === "live";
  const homeTeam = event.home_team?.name ?? event.home_team_name ?? "Home";
  const awayTeam = event.away_team?.name ?? event.away_team_name ?? "Away";
  const scoreline = event.scoreline ?? (event.home_score != null ? `${event.home_score}-${event.away_score}` : "vs");
  const leagueName = event.league?.name ?? event.league_name ?? "";
  const eventName = event.event_name ?? `${homeTeam} vs ${awayTeam}`;

  // Build selections from market rows
  const grouped = markets.filter((m) => m.market_type?.toLowerCase() === "1x2");
  const selections1x2 = grouped.length > 0 ? grouped.map((m) => ({
    marketId: m.id,
    label: m.selection?.toLowerCase() === "home" ? "1" : m.selection?.toLowerCase() === "draw" ? "X" : "2",
    odd: parseFloat(m.odds),
    selection: m.selection,
  })) : [];

  const labelFor = (item) =>
    item.selection?.toLowerCase() === "home" ? homeTeam
      : item.selection?.toLowerCase() === "draw" ? "Draw"
      : awayTeam;

  // Clicking odds adds/removes the selection on the floating bet slip.
  const handleSelect = (item) => {
    toggle({
      marketId: item.marketId,
      eventId: event.id,
      eventName,
      league: leagueName,
      marketType: "1x2",
      label: labelFor(item),
      selection: item.selection,
      odds: item.odd,
    });
  };

  return (
    <article className="card-hover min-w-[280px] max-w-[330px] flex-shrink-0 p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="truncate font-heading text-[11px] font-bold uppercase tracking-wide text-slate-500">{leagueName}</span>
        {isLive ? (
          <span className="badge shrink-0 border border-neon-red/40 bg-neon-red/10 text-neon-red">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-neon-red opacity-60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-neon-red" />
            </span>
            Live
          </span>
        ) : (
          <span className="shrink-0 text-xs text-slate-500">{event.time_event ?? event.date_event ?? ""}</span>
        )}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex flex-col items-start gap-1.5">
          {event.home_team?.logo_url && <img src={event.home_team.logo_url} alt="" loading="lazy" className="h-7 w-7 object-contain" />}
          <span className="font-heading text-sm font-semibold text-slate-900 dark:text-slate-100">{homeTeam}</span>
        </div>
        <span className={`rounded-lg px-2 py-1 font-display text-sm font-bold tabular-nums ${isLive ? "bg-gold/10 text-amber-600 dark:text-gold-l" : "text-slate-400"}`}>{scoreline}</span>
        <div className="flex flex-col items-end gap-1.5">
          {event.away_team?.logo_url && <img src={event.away_team.logo_url} alt="" loading="lazy" className="h-7 w-7 object-contain" />}
          <span className="text-right font-heading text-sm font-semibold text-slate-900 dark:text-slate-100">{awayTeam}</span>
        </div>
      </div>

      {selections1x2.length > 0 && (
        <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${selections1x2.length}, 1fr)` }}>
          {selections1x2.map((item) => (
            <OddsButton
              key={item.marketId}
              label={item.label}
              odd={item.odd}
              selected={has(item.marketId)}
              onClick={() => handleSelect(item)}
            />
          ))}
        </div>
      )}
    </article>
  );
}

const SPORT_TABS = [
  { id: "all",        label: "All" },
  { id: "Soccer",     label: "Football" },
  { id: "Basketball", label: "Basketball" },
  { id: "Tennis",     label: "Tennis" },
  { id: "American Football", label: "NFL" },
  { id: "MMA",        label: "MMA" },
];

const VIEWS = [
  { id: "today", label: "Today" },
  { id: "live", label: "Live" },
  { id: "upcoming", label: "Upcoming" },
];

export default function SportsBetting({ filterLeague, showHeader = true }) {
  const [activeTab, setActiveTab] = useState("all");
  const [view, setView] = useState("today"); // today | upcoming | live
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (view === "live") {
        data = await sportsApi.getLiveEvents();
      } else if (view === "upcoming") {
        data = await sportsApi.getUpcomingEvents();
      } else {
        data = await sportsApi.getTodayEvents();
      }
      setEvents(data.events ?? data ?? []);
    } catch (e) {
      setError(e.message ?? "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const filtered = events.filter((ev) => {
    if (activeTab !== "all" && ev.sport !== activeTab) return false;
    if (filterLeague && filterLeague !== "All" && ev.league?.name !== filterLeague) return false;
    return true;
  });

  return (
    <section className="bg-white py-16 dark:bg-ink-2">
      <div className="shell">
        {showHeader && (
          <SectionHeader
            badge="Sportsbook"
            accent="Live"
            title="sports markets"
            description="Pre-match and in-play odds across football, basketball, tennis, NFL and MMA."
          />
        )}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex overflow-hidden rounded-xl border border-[var(--pf-border)]" role="tablist" aria-label="Event view">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={view === v.id}
                onClick={() => setView(v.id)}
                className={`flex items-center gap-1.5 px-4 py-2 font-heading text-xs font-bold uppercase tracking-wide transition ${view === v.id ? "bg-purple/15 text-purple-d dark:bg-purple/25 dark:text-purple-l" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[.07]"}`}
              >
                {v.id === "live" && <span className="h-1.5 w-1.5 rounded-full bg-neon-red" />}
                {v.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SPORT_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`chip ${activeTab === tab.id ? "chip-active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 min-w-[280px] flex-shrink-0 rounded-2xl" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="card border-neon-red/25 bg-neon-red/[.04] p-8 text-center">
            <p className="text-sm font-medium text-neon-red">{error}</p>
            <button type="button" onClick={loadEvents} className="btn-danger mt-4 px-5 py-2 text-xs uppercase tracking-wider">Retry</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>}
            title="No events found"
            description="Try a different sport, league or time filter — new markets open all day."
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
            {filtered.map((event) => (
              <MatchCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
