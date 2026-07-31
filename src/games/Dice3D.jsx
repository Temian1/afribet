import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import originalsApi from '../services/originalsApi';
import Celebrate from './Celebrate';

const BETS = [1, 5, 10, 25, 50];
const PICKS = [
    { id: 'under', label: 'Under 7', pays: '2.30x' },
    { id: 'seven', label: 'Lucky 7', pays: '5.80x' },
    { id: 'over', label: 'Over 7', pays: '2.30x' },
];

/* Draw a die face (1–6 pips) onto a canvas texture. */
function faceTexture(value) {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#1e1b4b';
    const c = size / 2, o = size / 4, r = size / 11;
    const spots = {
        1: [[c, c]],
        2: [[o, o], [size - o, size - o]],
        3: [[o, o], [c, c], [size - o, size - o]],
        4: [[o, o], [size - o, o], [o, size - o], [size - o, size - o]],
        5: [[o, o], [size - o, o], [c, c], [o, size - o], [size - o, size - o]],
        6: [[o, o], [size - o, o], [o, c], [size - o, c], [o, size - o], [size - o, size - o]],
    };
    for (const [x, y] of spots[value]) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

/* Euler rotation that puts `value` on top. Material order: +x=1 −x=6 +y=2 −y=5 +z=3 −z=4 */
const TOP_ROTATION = {
    1: [0, 0, -Math.PI / 2],
    2: [0, 0, 0],
    3: [-Math.PI / 2, 0, 0],
    4: [Math.PI / 2, 0, 0],
    5: [Math.PI, 0, 0],
    6: [0, 0, Math.PI / 2],
};

export default function Dice3D() {
    const { balance, updateBalance, setBalance } = useApp();
    const { user } = useAuth();
    const { play } = useSound();
    const mountRef = useRef(null);
    const sceneRef = useRef(null); // { dice: [mesh, mesh], renderer, dispose }
    const animRef = useRef(null);
    const [bet, setBet] = useState(5);
    const [pick, setPick] = useState('over');
    const [rolling, setRolling] = useState(false);
    const [result, setResult] = useState(null);
    const [win, setWin] = useState(false);

    // Build the three.js scene once.
    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return undefined;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 100);
        camera.position.set(0, 4.2, 6.5);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.9));
        const key = new THREE.DirectionalLight(0xa78bfa, 2.2);
        key.position.set(4, 8, 5);
        scene.add(key);
        const rim = new THREE.PointLight(0xfbbf24, 30);
        rim.position.set(-4, 3, -3);
        scene.add(rim);

        // Neon floor grid
        const grid = new THREE.GridHelper(30, 30, 0x8b5cf6, 0x1e1b4b);
        grid.position.y = -1.05;
        scene.add(grid);

        const materials = [1, 6, 2, 5, 3, 4].map((v) => new THREE.MeshStandardMaterial({
            map: faceTexture(v), roughness: 0.35, metalness: 0.15,
        }));

        const geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6, 2, 2, 2);
        const dice = [-1.4, 1.4].map((x) => {
            const mesh = new THREE.Mesh(geometry, materials);
            mesh.position.set(x, 0, 0);
            scene.add(mesh);
            return mesh;
        });

        let frame;
        const renderLoop = () => {
            frame = requestAnimationFrame(renderLoop);
            renderer.render(scene, camera);
        };
        renderLoop();

        const onResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', onResize);

        sceneRef.current = { dice, renderer };
        return () => {
            cancelAnimationFrame(frame);
            if (animRef.current) cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            geometry.dispose();
            materials.forEach((m) => { m.map?.dispose(); m.dispose(); });
            mount.removeChild(renderer.domElement);
            sceneRef.current = null;
        };
    }, []);

    /* Tumble both dice for ~1.4s, then ease onto the target faces. */
    const animateRoll = (values, done) => {
        const { dice } = sceneRef.current || {};
        if (!dice) { done(); return; }

        const start = performance.now();
        const duration = 1500;
        const spins = dice.map(() => ({
            x: (4 + Math.random() * 3) * Math.PI * 2,
            y: (3 + Math.random() * 3) * Math.PI * 2,
            z: (2 + Math.random() * 2) * Math.PI * 2,
        }));
        const targets = values.map((v) => TOP_ROTATION[v]);

        const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            dice.forEach((mesh, i) => {
                mesh.rotation.set(
                    targets[i][0] + spins[i].x * (1 - ease),
                    targets[i][1] + spins[i].y * (1 - ease),
                    targets[i][2] + spins[i].z * (1 - ease),
                );
                mesh.position.y = Math.abs(Math.sin(p * Math.PI * 3)) * (1 - p) * 1.4;
            });
            if (p < 1) animRef.current = requestAnimationFrame(step);
            else done();
        };
        animRef.current = requestAnimationFrame(step);
    };

    const roll = async () => {
        if (rolling || balance < bet) return;
        play('roll');
        setRolling(true); setResult(null); setWin(false);

        // Server-authoritative when signed in; local demo otherwise.
        let dice; let won; let payout; let newBalance = null;
        if (user) {
            try {
                const res = await originalsApi.play('dice3d', bet, { pick });
                dice = res.result.dice;
                won = res.result.won;
                payout = res.payout;
                newBalance = res.new_balance;
            } catch (e) {
                setRolling(false);
                setResult({ dice: [1, 1], sum: 2, won: false, error: e.message });
                return;
            }
        } else {
            updateBalance(-bet);
            dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
            const sum = dice[0] + dice[1];
            won = (pick === 'over' && sum > 7) || (pick === 'under' && sum < 7) || (pick === 'seven' && sum === 7);
            payout = won ? bet * (pick === 'seven' ? 5.8 : 2.3) : 0;
        }

        animateRoll(dice, () => {
            const sum = dice[0] + dice[1];
            if (won) {
                if (!user) updateBalance(payout);
                play('bigWin'); setWin(true); setTimeout(() => setWin(false), 1800);
            } else play('lose');
            if (newBalance != null) setBalance(newBalance);
            setResult({ dice, sum, won, payout });
            setRolling(false);
        });
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-3 dark:bg-ink sm:p-4">
            <div className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-ink-2 sm:p-6">
                <Celebrate show={win} />
                <h2 className="bg-gradient-to-br from-purple-l via-purple to-gold-l bg-clip-text font-display text-xl font-black tracking-[2px] text-transparent sm:text-2xl">Dice Duel 3D</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Balance: <span className="font-display font-bold text-gold-l">${balance.toFixed(2)}</span> · Predict the sum of two dice</p>

                <div ref={mountRef} className="my-5 h-60 overflow-hidden rounded-2xl border border-purple/20 bg-gradient-to-b from-[#0b1026] to-black sm:h-64" />

                {result && (
                    <div className={`mb-4 rounded-lg border p-3 text-center font-bold ${result.won ? 'animate-pop border-neon-green/40 bg-neon-green/10 text-neon-green-l' : 'animate-shake border-neon-red/40 bg-neon-red/10 text-neon-red'}`}>
                        {result.error ? result.error : <>Rolled <span className="font-display">{result.dice[0]} + {result.dice[1]} = {result.sum}</span> — {result.won ? `Won $${Number(result.payout).toFixed(2)}!` : 'You lost.'}</>}
                    </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                    {PICKS.map((p) => (
                        <button key={p.id} onClick={() => { setPick(p.id); play('click'); }} disabled={rolling} type="button"
                            className={`rounded-lg border py-3 font-heading text-sm font-bold uppercase tracking-wider transition active:scale-95 disabled:opacity-60 ${pick === p.id ? 'border-purple bg-purple/15 text-purple-d dark:text-purple-l' : 'border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300'}`}>
                            {p.label}
                            <span className="block text-[10px] opacity-70">{p.pays}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {BETS.map((b) => (
                        <button key={b} onClick={() => { setBet(b); play('bet'); }} disabled={rolling}
                            className={`rounded-lg border px-3 py-2 font-heading text-sm font-bold transition active:scale-95 disabled:opacity-60 ${bet === b ? 'border-gold bg-gold/15 text-gold' : 'border-slate-200 text-slate-600 hover:border-gold/50 dark:border-white/10 dark:text-slate-300'}`} type="button">
                            ${b}
                        </button>
                    ))}
                </div>
                <button onClick={roll} disabled={rolling || balance < bet}
                    className="mt-5 w-full rounded-lg bg-gradient-to-br from-purple to-purple-d px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-white transition active:scale-[.98] disabled:opacity-50" type="button">
                    {rolling ? 'Rolling…' : `Roll $${bet}`}
                </button>
            </div>
        </div>
    );
}
