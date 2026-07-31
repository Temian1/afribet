// Synthesized casino SFX using the Web Audio API — no audio files required.
// A single shared AudioContext is created lazily on first user interaction.

let ctx = null;
let master = null;
let muted = false;

try {
    muted = localStorage.getItem('nb_muted') === '1';
} catch { /* ignore */ }

function ensure() {
    if (typeof window === 'undefined') return null;
    if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.5;
        master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
}

export function isMuted() { return muted; }
export function setMuted(v) {
    muted = v;
    try { localStorage.setItem('nb_muted', v ? '1' : '0'); } catch { /* ignore */ }
}

// A single oscillator "beep" with an ADSR-ish envelope.
function tone({ freq = 440, type = 'sine', start = 0, dur = 0.15, gain = 0.3, freqEnd, curve = 'exponential' }) {
    const ac = ensure();
    if (!ac || muted) return;
    const t0 = ac.currentTime + start;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd) {
        if (curve === 'linear') osc.frequency.linearRampToValueAtTime(freqEnd, t0 + dur);
        else osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + dur);
    }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
}

// Filtered white-noise burst — used for dice rattle, crash explosion, whooshes.
function noise({ start = 0, dur = 0.3, gain = 0.3, type = 'lowpass', freq = 1000, freqEnd, q = 1 }) {
    const ac = ensure();
    if (!ac || muted) return;
    const t0 = ac.currentTime + start;
    const frames = Math.floor(ac.sampleRate * dur);
    const buf = ac.createBuffer(1, frames, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = buf;
    const filt = ac.createBiquadFilter();
    filt.type = type;
    filt.frequency.setValueAtTime(freq, t0);
    filt.Q.value = q;
    if (freqEnd) filt.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + dur);
    const g = ac.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filt); filt.connect(g); g.connect(master);
    src.start(t0);
    src.stop(t0 + dur);
}

function arpeggio(freqs, { step = 0.09, type = 'triangle', dur = 0.16, gain = 0.28 } = {}) {
    freqs.forEach((f, i) => tone({ freq: f, type, start: i * step, dur, gain }));
}

// ---- Named SFX ----
const SFX = {
    click: () => tone({ freq: 320, type: 'square', dur: 0.05, gain: 0.12 }),
    bet: () => tone({ freq: 520, type: 'square', dur: 0.06, gain: 0.14 }),
    tick: () => tone({ freq: 900, type: 'square', dur: 0.03, gain: 0.08 }),

    spin: () => { noise({ dur: 0.5, gain: 0.12, type: 'bandpass', freq: 400, freqEnd: 1600, q: 2 }); tone({ freq: 200, freqEnd: 600, type: 'sawtooth', dur: 0.5, gain: 0.08 }); },
    reelStop: () => tone({ freq: 260, type: 'square', dur: 0.07, gain: 0.18 }),

    roll: () => { noise({ dur: 0.35, gain: 0.25, type: 'highpass', freq: 1200, q: 1 }); noise({ start: 0.12, dur: 0.2, gain: 0.18, type: 'highpass', freq: 1800 }); },
    drop: () => tone({ freq: 700, freqEnd: 300, type: 'sine', dur: 0.18, gain: 0.2 }),
    pegHit: () => tone({ freq: 1200 + Math.random() * 600, type: 'triangle', dur: 0.03, gain: 0.1 }),

    card: () => noise({ dur: 0.12, gain: 0.22, type: 'highpass', freq: 2000, freqEnd: 600 }),
    chip: () => { tone({ freq: 880, type: 'square', dur: 0.05, gain: 0.14 }); tone({ freq: 1320, type: 'square', start: 0.04, dur: 0.05, gain: 0.1 }); },

    launch: () => { tone({ freq: 120, freqEnd: 900, type: 'sawtooth', dur: 1.2, gain: 0.12 }); noise({ dur: 1.2, gain: 0.08, type: 'lowpass', freq: 300, freqEnd: 1200 }); },
    cashout: () => arpeggio([784, 1047, 1319, 1568], { step: 0.07, dur: 0.18, gain: 0.24 }),
    crash: () => { noise({ dur: 0.6, gain: 0.4, type: 'lowpass', freq: 1800, freqEnd: 80, q: 1 }); tone({ freq: 160, freqEnd: 40, type: 'sawtooth', dur: 0.6, gain: 0.18 }); },

    win: () => arpeggio([523, 659, 784], { step: 0.08, dur: 0.16, gain: 0.24 }),
    bigWin: () => arpeggio([523, 659, 784, 1047, 1319, 1568], { step: 0.09, dur: 0.2, gain: 0.26 }),
    lose: () => arpeggio([392, 330, 262], { step: 0.1, type: 'sine', dur: 0.22, gain: 0.2 }),
    push: () => arpeggio([440, 440], { step: 0.12, type: 'sine', dur: 0.16, gain: 0.16 }),
};

export function playSound(name) {
    const fn = SFX[name];
    if (fn) { try { fn(); } catch { /* ignore */ } }
}
