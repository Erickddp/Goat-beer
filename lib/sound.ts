"use client";

import { create } from "zustand";
import { sfx } from "@/content/hero";

/**
 * Audio del sitio con Web Audio API.
 * Los navegadores bloquean el audio hasta un gesto del usuario: el clic del age
 * gate (o el primer toque/tecla en visitas posteriores) llama a `unlock()`.
 */

type SfxName = keyof typeof sfx;

let ctx: AudioContext | null = null;
const buffers = new Map<SfxName, AudioBuffer | "synth">();
const loading = new Map<SfxName, Promise<void>>();

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function load(name: SfxName) {
  if (!loading.has(name)) loading.set(name, fetchBuffer(name));
  return loading.get(name)!;
}

async function fetchBuffer(name: SfxName) {
  const ac = getCtx();
  if (!ac) return;
  try {
    const res = await fetch(sfx[name]);
    if (!res.ok) throw new Error(String(res.status));
    buffers.set(name, await ac.decodeAudioData(await res.arrayBuffer()));
  } catch {
    // Sin archivo todavía (pour.mp4 no existe): placeholder sintetizado
    buffers.set(name, "synth");
  }
}

/** "Pop" de corcholata sintetizado: golpe de ruido filtrado + tono que cae. */
function synthPop(ac: AudioContext, out: AudioNode) {
  const t = ac.currentTime;

  const noise = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.05), ac.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3;
  const burst = ac.createBufferSource();
  burst.buffer = noise;
  const hp = ac.createBiquadFilter();
  hp.type = "bandpass";
  hp.frequency.value = 1800;
  hp.Q.value = 0.8;
  const nGain = ac.createGain();
  nGain.gain.setValueAtTime(0.9, t);
  nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  burst.connect(hp).connect(nGain).connect(out);

  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(900, t);
  osc.frequency.exponentialRampToValueAtTime(140, t + 0.09);
  const oGain = ac.createGain();
  oGain.gain.setValueAtTime(0.0001, t);
  oGain.gain.exponentialRampToValueAtTime(0.6, t + 0.004);
  oGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  osc.connect(oGain).connect(out);

  burst.start(t);
  osc.start(t);
  osc.stop(t + 0.15);
}

const MUTE_KEY = "goat-muted";

interface SoundState {
  unlocked: boolean;
  muted: boolean;
  unlock(): Promise<void>;
  toggleMute(): void;
  play(name: SfxName): void;
}

export const useSound = create<SoundState>()((set, get) => ({
  unlocked: false,
  muted: (() => {
    try {
      return typeof window !== "undefined" && localStorage.getItem(MUTE_KEY) === "1";
    } catch {
      return false;
    }
  })(),

  unlock: async () => {
    const ac = getCtx();
    if (!ac) return;
    try {
      if (ac.state === "suspended") await ac.resume();
    } catch {
      return;
    }
    set({ unlocked: ac.state === "running" });
    await Promise.all((Object.keys(sfx) as SfxName[]).map(load));
  },

  toggleMute: () => {
    const muted = !get().muted;
    set({ muted });
    try {
      localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
    } catch {
      /* noop */
    }
    // El propio clic del botón es un gesto válido: aprovechar para desbloquear
    if (!muted && !get().unlocked) void get().unlock();
  },

  play: (name) => {
    const { muted, unlocked } = get();
    const ac = ctx;
    if (muted || !unlocked || !ac || ac.state !== "running") return;
    const buf = buffers.get(name);
    const gain = ac.createGain();
    gain.gain.value = 0.8;
    gain.connect(ac.destination);
    if (buf && buf !== "synth") {
      const src = ac.createBufferSource();
      src.buffer = buf;
      src.connect(gain);
      src.start();
    } else if (name === "pop") {
      synthPop(ac, gain);
    }
  },
}));
