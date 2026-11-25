// Web Speech API (Standard Bahasa Melayu) + Web Audio API Pokémon Theme & SFX utilities

let audioCtx: AudioContext | null = null;
let themeIntervalId: number | null = null;
let themeStep = 0;
let themePlaying = false;
let themeDuckFactor = 1;
const themeListeners = new Set<(playing: boolean) => void>();

function notifyThemeListeners() {
  themeListeners.forEach((cb) => cb(themePlaying));
}

export function subscribeThemeMusic(listener: (playing: boolean) => void): () => void {
  themeListeners.add(listener);
  listener(themePlaying);
  return () => {
    themeListeners.delete(listener);
  };
}

export function isThemeMusicPlaying(): boolean {
  return themePlaying;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}
export function unlockAudioContext(): AudioContext | null {
  return getAudioContext();
}
export function playToneSequence(
  notes: { freq: number; duration: number; delay: number; type?: OscillatorType; volume?: number }[]
): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    notes.forEach((n) => {
      if (n.freq <= 0) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = n.type || 'triangle';
      osc.frequency.setValueAtTime(n.freq, now + n.delay);
      const peak = n.volume ?? 0.08;
      gain.gain.setValueAtTime(0.001, now + n.delay);
      gain.gain.exponentialRampToValueAtTime(peak, now + n.delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.delay + n.duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.delay);
      osc.stop(now + n.delay + n.duration + 0.02);
    });
  } catch {
    // Ignore audio context restrictions gracefully
  }
}

export function playClickPop(): void {
  playToneSequence([{ freq: 587.33, duration: 0.07, delay: 0, type: 'triangle', volume: 0.06 }]);
}

export function playVideoStartJingle(): void {
  playToneSequence([
    { freq: 523.25, duration: 0.09, delay: 0, type: 'triangle', volume: 0.07 },
    { freq: 659.25, duration: 0.09, delay: 0.08, type: 'triangle', volume: 0.075 },
    { freq: 783.99, duration: 0.14, delay: 0.16, type: 'triangle', volume: 0.085 },
  ]);
}

export function playSceneTransitionTone(): void {
  playToneSequence([
    { freq: 659.25, duration: 0.08, delay: 0, type: 'sine', volume: 0.05 },
    { freq: 880, duration: 0.12, delay: 0.07, type: 'sine', volume: 0.055 },
  ]);
}

// Lagu apabila murid berjaya menjawab soalan (Pokémon Victory / Capture Chime)
export function playSuccessChime(): void {
  playToneSequence([
    { freq: 523.25, duration: 0.1, delay: 0, type: 'square', volume: 0.055 }, // C5
    { freq: 659.25, duration: 0.1, delay: 0.09, type: 'square', volume: 0.055 }, // E5
    { freq: 783.99, duration: 0.1, delay: 0.18, type: 'square', volume: 0.055 }, // G5
    { freq: 1046.5, duration: 0.28, delay: 0.28, type: 'triangle', volume: 0.095 }, // C6
    { freq: 783.99, duration: 0.1, delay: 0.42, type: 'triangle', volume: 0.06 }, // G5
    { freq: 1046.5, duration: 0.36, delay: 0.52, type: 'triangle', volume: 0.1 }, // C6
  ]);
}

// Lagu apabila murid salah menjawab soalan (Pokémon Try Again / Gentle Descending)
export function playTryAgainTone(): void {
  playToneSequence([
    { freq: 440, duration: 0.14, delay: 0, type: 'triangle', volume: 0.07 }, // A4
    { freq: 392, duration: 0.14, delay: 0.13, type: 'triangle', volume: 0.07 }, // G4
    { freq: 349.23, duration: 0.16, delay: 0.26, type: 'triangle', volume: 0.07 }, // F4
    { freq: 293.66, duration: 0.28, delay: 0.4, type: 'sine', volume: 0.08 }, // D4
  ]);
}

// Lagu kemenangan apabila melengkapkan keseluruhan misi (Pokémon Gym Badge Fanfare)
export function playVictoryFanfare(): void {
  playToneSequence([
    { freq: 523.25, duration: 0.11, delay: 0, type: 'square', volume: 0.055 },
    { freq: 523.25, duration: 0.11, delay: 0.12, type: 'square', volume: 0.055 },
    { freq: 523.25, duration: 0.11, delay: 0.24, type: 'square', volume: 0.055 },
    { freq: 659.25, duration: 0.22, delay: 0.36, type: 'triangle', volume: 0.09 },
    { freq: 587.33, duration: 0.12, delay: 0.58, type: 'triangle', volume: 0.08 },
    { freq: 659.25, duration: 0.12, delay: 0.7, type: 'triangle', volume: 0.08 },
    { freq: 783.99, duration: 0.22, delay: 0.82, type: 'triangle', volume: 0.095 },
    { freq: 1046.5, duration: 0.42, delay: 1.04, type: 'triangle', volume: 0.1 },
  ]);
}

// Lagu Tema Pengembaraan Pokémon (Upbeat looping adventure motif)
const POKEMON_THEME_MELODY: { lead: number; bass: number }[] = [
  { lead: 392.0, bass: 196.0 }, // G4
  { lead: 523.25, bass: 130.81 }, // C5
  { lead: 587.33, bass: 130.81 }, // D5
  { lead: 659.25, bass: 196.0 }, // E5
  { lead: 659.25, bass: 164.81 }, // E5
  { lead: 0, bass: 196.0 },
  { lead: 587.33, bass: 146.83 }, // D5
  { lead: 523.25, bass: 130.81 }, // C5
  { lead: 440.0, bass: 110.0 }, // A4
  { lead: 523.25, bass: 130.81 }, // C5
  { lead: 587.33, bass: 146.83 }, // D5
  { lead: 659.25, bass: 164.81 }, // E5
  { lead: 587.33, bass: 196.0 }, // D5
  { lead: 587.33, bass: 196.0 }, // D5
  { lead: 0, bass: 146.83 },
  { lead: 392.0, bass: 196.0 }, // G4
  { lead: 659.25, bass: 130.81 }, // E5
  { lead: 698.46, bass: 174.61 }, // F5
  { lead: 783.99, bass: 196.0 }, // G5
  { lead: 783.99, bass: 196.0 }, // G5
  { lead: 698.46, bass: 174.61 }, // F5
  { lead: 659.25, bass: 164.81 }, // E5
  { lead: 587.33, bass: 146.83 }, // D5
  { lead: 523.25, bass: 130.81 }, // C5
  { lead: 587.33, bass: 146.83 }, // D5
  { lead: 659.25, bass: 164.81 }, // E5
  { lead: 587.33, bass: 196.0 }, // D5
  { lead: 493.88, bass: 196.0 }, // B4
  { lead: 523.25, bass: 130.81 }, // C5
  { lead: 523.25, bass: 130.81 }, // C5
  { lead: 0, bass: 196.0 },
  { lead: 0, bass: 130.81 },
];

export function startPokemonTheme(): void {
  if (typeof window === 'undefined' || themePlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  themePlaying = true;
  notifyThemeListeners();

  const playStep = () => {
    if (!themePlaying) return;
    const step = POKEMON_THEME_MELODY[themeStep % POKEMON_THEME_MELODY.length];
    themeStep = (themeStep + 1) % POKEMON_THEME_MELODY.length;

    const notes: { freq: number; duration: number; delay: number; type?: OscillatorType; volume?: number }[] = [];
    if (step.lead > 0) {
      notes.push({
        freq: step.lead,
        duration: 0.19,
        delay: 0,
        type: 'triangle',
        volume: 0.072 * themeDuckFactor,
      });
    }
    if (step.bass > 0) {
      notes.push({
        freq: step.bass,
        duration: 0.18,
        delay: 0,
        type: 'sine',
        volume: 0.052 * themeDuckFactor,
      });
    }
    if (notes.length > 0) {
      playToneSequence(notes);
    }
  };

  playStep();
  themeIntervalId = window.setInterval(playStep, 230);
}

export function stopPokemonTheme(): void {
  themePlaying = false;
  if (themeIntervalId !== null && typeof window !== 'undefined') {
    window.clearInterval(themeIntervalId);
    themeIntervalId = null;
  }
  notifyThemeListeners();
}

export function togglePokemonTheme(): boolean {
  if (themePlaying) {
    stopPokemonTheme();
  } else {
    startPokemonTheme();
  }
  return themePlaying;
}

// --- Natural Bahasa Melayu Speech Synthesis (Gemini TTS + Web Speech Fallback) ---

let cachedVoices: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

if (typeof window !== 'undefined') {
  const unlockOnce = () => {
    unlockAudioContext();
  };
  window.addEventListener('pointerdown', unlockOnce, { once: true, passive: true });
  window.addEventListener('keydown', unlockOnce, { once: true, passive: true });
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined';
}

export function hasBrowserSpeechApi(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined'
  );
}

const CLIENT_TTS_CACHE_LIMIT = 80;
const clientWavCache = new Map<string, ArrayBuffer>();
const inflightTtsFetches = new Map<string, Promise<ArrayBuffer | null>>();
let ttsUnavailableUntil = 0;

let activeUtterance: SpeechSynthesisUtterance | null = null;
let activeBufferSource: AudioBufferSourceNode | null = null;
let activeHtmlAudio: HTMLAudioElement | null = null;
let activeHtmlAudioUrl: string | null = null;
let activeProgressTimerId: number | null = null;
let pendingSpeakTimerId: number | null = null;
let speakRequestSeq = 0;

function clearActiveAudioPlayback(): void {
  if (activeProgressTimerId !== null && typeof window !== 'undefined') {
    window.clearInterval(activeProgressTimerId);
    activeProgressTimerId = null;
  }
  if (pendingSpeakTimerId !== null && typeof window !== 'undefined') {
    window.clearTimeout(pendingSpeakTimerId);
    pendingSpeakTimerId = null;
  }
  if (activeBufferSource) {
    try {
      activeBufferSource.onended = null;
      activeBufferSource.stop();
      activeBufferSource.disconnect();
    } catch {
      // Ignore already stopped source
    }
    activeBufferSource = null;
  }
  if (activeHtmlAudio) {
    try {
      activeHtmlAudio.onended = null;
      activeHtmlAudio.onerror = null;
      activeHtmlAudio.pause();
      activeHtmlAudio.src = '';
    } catch {
      // Ignore cleanup errors
    }
    activeHtmlAudio = null;
  }
  if (activeHtmlAudioUrl) {
    URL.revokeObjectURL(activeHtmlAudioUrl);
    activeHtmlAudioUrl = null;
  }
  activeUtterance = null;
  if (hasBrowserSpeechApi()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore synthesis cancel errors
    }
  }
}

export function stopSpeaking(): void {
  speakRequestSeq += 1;
  themeDuckFactor = 1;
  clearActiveAudioPlayback();
}

/**
 * Menyelaraskan teks untuk sebutan Bahasa Melayu standard:
 * - "syampu" mengekalkan bunyi "sy" seperti dalam perkataan "syurga".
 * - "berus" mengekalkan bunyi "be" (e-pepet) seperti dalam perkataan "beguk".
 * - Suku kata bertitik (cth: "syam · pu", "be · rus") disambung supaya disebut lancar.
 * - Perkataan huruf besar penuh ditukar kepada huruf kecil supaya tidak dieja satu-persatu.
 */
export function normalizeMalayForSpeech(rawText: string): string {
  return rawText
    .replace(/\b[A-Z]{2,}\b/g, (word) => word.toLowerCase())
    .replace(/\s*·\s*/g, ' ')
    .replace(/\bsy[\s-]*am[\s-]*pu\b/gi, 'syampu')
    .replace(/\bsyam[\s-]*pu\b/gi, 'syampu')
    .replace(/\bbe[\s-]*rus\b/gi, 'berus')
    .replace(/\bsa[\s-]*bun\b/gi, 'sabun')
    .replace(/\bgi[\s-]*gi\b/gi, 'gigi')
    .replace(/\btu[\s-]*a[\s-]*la\b/gi, 'tuala')
    .replace(/\bsi[\s-]*kat\b/gi, 'sikat')
    .replace(/pokémon/gi, 'Pokemon')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCachedClientWav(key: string): ArrayBuffer | undefined {
  const found = clientWavCache.get(key);
  if (!found) return undefined;
  clientWavCache.delete(key);
  clientWavCache.set(key, found);
  return found;
}

function setCachedClientWav(key: string, buf: ArrayBuffer): void {
  if (clientWavCache.has(key)) {
    clientWavCache.delete(key);
  } else if (clientWavCache.size >= CLIENT_TTS_CACHE_LIMIT) {
    const oldestKey = clientWavCache.keys().next().value;
    if (oldestKey !== undefined) {
      clientWavCache.delete(oldestKey);
    }
  }
  clientWavCache.set(key, buf);
}

async function fetchNaturalMalayWav(speechText: string): Promise<ArrayBuffer | null> {
  const cached = getCachedClientWav(speechText);
  if (cached) return cached;

  if (Date.now() < ttsUnavailableUntil) return null;

  const existing = inflightTtsFetches.get(speechText);
  if (existing) return existing;

  const promise = (async (): Promise<ArrayBuffer | null> => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: speechText }),
      });
      if (!response.ok) {
        if (response.status === 503) {
          ttsUnavailableUntil = Date.now() + 60_000;
        }
        return null;
      }
      const contentType = response.headers.get('Content-Type') || '';
      if (!contentType.includes('audio')) return null;
      const buffer = await response.arrayBuffer();
      if (!buffer || buffer.byteLength < 64) return null;
      setCachedClientWav(speechText, buffer);
      return buffer;
    } catch {
      return null;
    } finally {
      inflightTtsFetches.delete(speechText);
    }
  })();

  inflightTtsFetches.set(speechText, promise);
  return promise;
}

export function getCachedMalaySpeechWavBuffer(text: string): ArrayBuffer | null {
  const speechText = normalizeMalayForSpeech(text);
  if (!speechText) return null;
  return getCachedClientWav(speechText) ?? null;
}

export async function fetchMalaySpeechWavBuffer(text: string): Promise<ArrayBuffer | null> {
  const speechText = normalizeMalayForSpeech(text);
  if (!speechText) return null;
  return fetchNaturalMalayWav(speechText);
}

export function prefetchMalaySpeech(text: string): void {
  if (typeof window === 'undefined') return;
  const speechText = normalizeMalayForSpeech(text);
  if (!speechText) return;
  void fetchNaturalMalayWav(speechText);
}

function scoreVoiceQuality(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase().replace('_', '-');
  let score = 0;

  if (lang === 'ms-my' || lang.startsWith('ms-my-')) score += 100;
  else if (lang.startsWith('ms')) score += 80;
  else if (lang.startsWith('id')) score += 40;
  else return -1;

  if (name.includes('natural') || name.includes('neural') || name.includes('online')) score += 30;
  if (name.includes('google')) score += 20;
  if (name.includes('microsoft')) score += 15;
  if (!voice.localService) score += 10;

  return score;
}

export function selectStandardMalayVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (!voices || voices.length === 0) return undefined;

  let bestVoice: SpeechSynthesisVoice | undefined;
  let bestScore = -1;
  for (const voice of voices) {
    const score = scoreVoiceQuality(voice);
    if (score > bestScore) {
      bestScore = score;
      bestVoice = voice;
    }
  }
  return bestVoice;
}

interface SpeakCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onBoundary?: (charIndex: number, totalChars: number) => void;
}

function speakWithWebSpeechFallback(
  mySeq: number,
  speechText: string,
  callbacks?: SpeakCallbacks
): void {
  if (mySeq !== speakRequestSeq) return;

  if (!hasBrowserSpeechApi()) {
    playClickPop();
    callbacks?.onStart?.();
    pendingSpeakTimerId = window.setTimeout(() => {
      pendingSpeakTimerId = null;
      if (mySeq !== speakRequestSeq) return;
      themeDuckFactor = 1;
      callbacks?.onEnd?.();
    }, 900);
    return;
  }

  try {
    const synth = window.speechSynthesis;
    if (synth.paused) {
      synth.resume();
    }
    const needsCancel = synth.speaking || synth.pending;
    if (needsCancel) {
      synth.cancel();
    }

    const startSpeech = () => {
      if (mySeq !== speakRequestSeq) return;
      const utterance = new SpeechSynthesisUtterance(speechText);
      activeUtterance = utterance;
      const voices = synth.getVoices();
      const availableVoices = voices.length > 0 ? voices : cachedVoices;
      const malayVoice = selectStandardMalayVoice(availableVoices);

      if (malayVoice) {
        utterance.voice = malayVoice;
        utterance.lang = malayVoice.lang;
      } else {
        utterance.lang = 'ms-MY';
      }

      utterance.rate = 0.94;
      utterance.pitch = 1.0;

      let ended = false;
      const finish = () => {
        if (ended) return;
        ended = true;
        if (activeUtterance === utterance) {
          activeUtterance = null;
        }
        themeDuckFactor = 1;
        callbacks?.onEnd?.();
      };

      utterance.onstart = () => {
        if (mySeq !== speakRequestSeq || activeUtterance !== utterance) return;
        themeDuckFactor = 0.25;
        callbacks?.onStart?.();
      };
      utterance.onboundary = (event) => {
        if (mySeq !== speakRequestSeq || activeUtterance !== utterance) return;
        callbacks?.onBoundary?.(event.charIndex, speechText.length);
      };
      utterance.onend = finish;
      utterance.onerror = finish;

      if (synth.paused) {
        synth.resume();
      }
      synth.speak(utterance);
    };

    if (needsCancel) {
      pendingSpeakTimerId = window.setTimeout(() => {
        pendingSpeakTimerId = null;
        startSpeech();
      }, 45);
    } else {
      startSpeech();
    }
  } catch {
    themeDuckFactor = 1;
    activeUtterance = null;
    callbacks?.onEnd?.();
  }
}

async function playNaturalWavViaAudioContext(
  mySeq: number,
  wavBuffer: ArrayBuffer,
  speechText: string,
  callbacks?: SpeakCallbacks
): Promise<boolean> {
  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    const decoded = await ctx.decodeAudioData(wavBuffer.slice(0));
    if (mySeq !== speakRequestSeq) return true;

    const source = ctx.createBufferSource();
    source.buffer = decoded;
    source.connect(ctx.destination);
    activeBufferSource = source;

    const totalChars = Math.max(1, speechText.length);
    const duration = Math.max(0.2, decoded.duration);
    const startTime = ctx.currentTime;
    let finished = false;

    const cleanup = (notifyEnd: boolean) => {
      if (finished) return;
      finished = true;
      if (activeProgressTimerId !== null) {
        window.clearInterval(activeProgressTimerId);
        activeProgressTimerId = null;
      }
      if (activeBufferSource === source) {
        activeBufferSource = null;
      }
      themeDuckFactor = 1;
      if (notifyEnd && mySeq === speakRequestSeq) {
        callbacks?.onBoundary?.(totalChars, totalChars);
        callbacks?.onEnd?.();
      }
    };

    source.onended = () => cleanup(true);

    themeDuckFactor = 0.25;
    callbacks?.onStart?.();
    callbacks?.onBoundary?.(0, totalChars);

    activeProgressTimerId = window.setInterval(() => {
      if (finished || mySeq !== speakRequestSeq) {
        if (activeProgressTimerId !== null) {
          window.clearInterval(activeProgressTimerId);
          activeProgressTimerId = null;
        }
        return;
      }
      const elapsed = Math.max(0, ctx.currentTime - startTime);
      const ratio = Math.min(0.99, elapsed / duration);
      callbacks?.onBoundary?.(Math.floor(ratio * totalChars), totalChars);
    }, 70);

    source.start(0);
    return true;
  } catch {
    return false;
  }
}

async function playNaturalWavViaHtmlAudio(
  mySeq: number,
  wavBuffer: ArrayBuffer,
  speechText: string,
  callbacks?: SpeakCallbacks
): Promise<boolean> {
  try {
    const blobUrl = URL.createObjectURL(new Blob([wavBuffer], { type: 'audio/wav' }));
    if (mySeq !== speakRequestSeq) {
      URL.revokeObjectURL(blobUrl);
      return true;
    }

    const audio = new Audio(blobUrl);
    activeHtmlAudio = audio;
    activeHtmlAudioUrl = blobUrl;

    const totalChars = Math.max(1, speechText.length);
    let finished = false;

    const cleanup = (notifyEnd: boolean) => {
      if (finished) return;
      finished = true;
      if (activeProgressTimerId !== null) {
        window.clearInterval(activeProgressTimerId);
        activeProgressTimerId = null;
      }
      if (activeHtmlAudio === audio) {
        activeHtmlAudio = null;
      }
      if (activeHtmlAudioUrl === blobUrl) {
        URL.revokeObjectURL(blobUrl);
        activeHtmlAudioUrl = null;
      }
      themeDuckFactor = 1;
      if (notifyEnd && mySeq === speakRequestSeq) {
        callbacks?.onBoundary?.(totalChars, totalChars);
        callbacks?.onEnd?.();
      }
    };

    audio.onended = () => cleanup(true);
    audio.onerror = () => cleanup(false);

    await audio.play();
    if (mySeq !== speakRequestSeq) {
      cleanup(false);
      return true;
    }

    themeDuckFactor = 0.25;
    callbacks?.onStart?.();
    callbacks?.onBoundary?.(0, totalChars);

    activeProgressTimerId = window.setInterval(() => {
      if (finished || mySeq !== speakRequestSeq) return;
      const duration = audio.duration && isFinite(audio.duration) ? audio.duration : 0;
      if (duration > 0) {
        const ratio = Math.min(0.99, Math.max(0, audio.currentTime / duration));
        callbacks?.onBoundary?.(Math.floor(ratio * totalChars), totalChars);
      }
    }, 70);

    return true;
  } catch {
    return false;
  }
}

export function speakMalay(text: string, callbacks?: SpeakCallbacks): boolean {
  if (typeof window === 'undefined') {
    callbacks?.onEnd?.();
    return false;
  }

  const speechText = normalizeMalayForSpeech(text);
  if (!speechText) {
    callbacks?.onEnd?.();
    return false;
  }

  speakRequestSeq += 1;
  const mySeq = speakRequestSeq;
  themeDuckFactor = 1;
  clearActiveAudioPlayback();
  unlockAudioContext();

  void (async () => {
    const wavBuffer = await fetchNaturalMalayWav(speechText);
    if (mySeq !== speakRequestSeq) return;

    if (wavBuffer) {
      const playedViaCtx = await playNaturalWavViaAudioContext(
        mySeq,
        wavBuffer,
        speechText,
        callbacks
      );
      if (playedViaCtx || mySeq !== speakRequestSeq) return;

      const playedViaHtml = await playNaturalWavViaHtmlAudio(
        mySeq,
        wavBuffer,
        speechText,
        callbacks
      );
      if (playedViaHtml || mySeq !== speakRequestSeq) return;
    }

    speakWithWebSpeechFallback(mySeq, speechText, callbacks);
  })();

  return true;
}
