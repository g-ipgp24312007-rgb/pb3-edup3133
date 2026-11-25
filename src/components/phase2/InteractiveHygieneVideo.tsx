import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  Maximize,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { HERO_MEDIA } from '../../data/phase1Data';
import { HYGIENE_WORD_MAP, PHASE2_VIDEO_CHECKPOINTS } from '../../data/phases2to5Data';
import { PokemonCharacterId, VideoCheckpointQuestion } from '../../types/learning';
import {
  isSpeechSupported,
  playClickPop,
  playSceneTransitionTone,
  playVideoStartJingle,
  prefetchMalaySpeech,
  speakMalay,
  stopSpeaking,
  unlockAudioContext,
} from '../../utils/audio';
import { CHARACTER_META, CharacterAvatar, ResilientImage } from '../PokemonIcons';

interface VideoScene {
  id: string;
  number: number;
  startSec: number;
  endSec: number;
  title: string;
  targetWord?: string;
  syllables?: string;
  imageUrl: string;
  imageAlt: string;
  objectThumbUrl?: string;
  host: PokemonCharacterId;
  companions: PokemonCharacterId[];
  hostCallout: string;
  effectType: 'parade' | 'bubbles' | 'sparkle-water' | 'breeze' | 'foam' | 'stars';
  narration: string;
  checkpointTriggerSec?: number;
  checkpointId?: string;
}

export const BUILTIN_VIDEO_DURATION = 42;

export const BUILTIN_VIDEO_SCENES: VideoScene[] = [
  {
    id: 'scene-1',
    number: 1,
    startSec: 0,
    endSec: 7,
    title: 'Pengenalan: Jom Bersihkan Diri!',
    targetWord: 'JOM BERSIHKAN DIRI!',
    syllables: '5 Perkataan Sasaran',
    imageUrl: HERO_MEDIA.heroImage,
    imageAlt: HERO_MEDIA.heroAlt,
    host: 'pikachu',
    companions: ['pikachu', 'squirtle', 'bulbasaur', 'charmander', 'eevee'],
    hostCallout: 'Pika Pika! Jom mula!',
    effectType: 'parade',
    narration:
      'Hai Pelatih! Mari tonton video Jom Bersihkan Diri dan kenali lima perkataan kebersihan diri bersama Pokémon!',
  },
  {
    id: 'scene-2',
    number: 2,
    startSec: 7,
    endSec: 14,
    title: 'Perkataan 1: Sabun',
    targetWord: HYGIENE_WORD_MAP.sabun.word,
    syllables: HYGIENE_WORD_MAP.sabun.syllables,
    imageUrl: '/src/assets/images/hygiene_wash_hands_boy_1795568375722.jpg',
    imageAlt: 'Murid lelaki mencuci tangan menggunakan sabun berbuih.',
    objectThumbUrl: HYGIENE_WORD_MAP.sabun.imageUrl,
    host: 'pikachu',
    companions: ['pikachu', 'squirtle'],
    hostCallout: 'Cuci guna sabun!',
    effectType: 'bubbles',
    narration:
      'Pertama, SABUN. Kita menggunakan sabun untuk mencuci tangan dan badan supaya bersih daripada kuman.',
    checkpointTriggerSec: 13.7,
    checkpointId: 'cp-1',
  },
  {
    id: 'scene-3',
    number: 3,
    startSec: 14,
    endSec: 21,
    title: 'Perkataan 2: Berus Gigi',
    targetWord: HYGIENE_WORD_MAP['berus-gigi'].word,
    syllables: HYGIENE_WORD_MAP['berus-gigi'].syllables,
    imageUrl: '/src/assets/images/hygiene_brush_teeth_boy_mirror_1795568612899.jpg',
    imageAlt: 'Murid lelaki menggosok gigi di hadapan cermin bilik mandi.',
    objectThumbUrl: HYGIENE_WORD_MAP['berus-gigi'].imageUrl,
    host: 'squirtle',
    companions: ['squirtle', 'pikachu'],
    hostCallout: 'Squirtle! Gigi bersih!',
    effectType: 'sparkle-water',
    narration:
      'Kedua, BERUS GIGI. Kita menggunakan berus gigi untuk membersihkan gigi setiap pagi dan malam.',
    checkpointTriggerSec: 20.7,
    checkpointId: 'cp-2',
  },
  {
    id: 'scene-4',
    number: 4,
    startSec: 21,
    endSec: 28,
    title: 'Perkataan 3: Tuala',
    targetWord: HYGIENE_WORD_MAP.tuala.word,
    syllables: HYGIENE_WORD_MAP.tuala.syllables,
    imageUrl: '/src/assets/images/routine_dry_towel_1795571891747.jpg',
    imageAlt: 'Murid mengeringkan badan dan rambut menggunakan tuala.',
    objectThumbUrl: HYGIENE_WORD_MAP.tuala.imageUrl,
    host: 'bulbasaur',
    companions: ['bulbasaur', 'eevee'],
    hostCallout: 'Bulba! Lap badan!',
    effectType: 'breeze',
    narration:
      'Ketiga, TUALA. Selepas mandi, kita menggunakan tuala lembut untuk mengeringkan badan.',
    checkpointTriggerSec: 27.7,
    checkpointId: 'cp-3',
  },
  {
    id: 'scene-5',
    number: 5,
    startSec: 28,
    endSec: 35,
    title: 'Perkataan 4: Syampu',
    targetWord: HYGIENE_WORD_MAP.syampu.word,
    syllables: HYGIENE_WORD_MAP.syampu.syllables,
    imageUrl: '/src/assets/images/routine_shampoo_hair_1795571890456.jpg',
    imageAlt: 'Murid mencuci rambut menggunakan syampu berbuih.',
    objectThumbUrl: HYGIENE_WORD_MAP.syampu.imageUrl,
    host: 'charmander',
    companions: ['charmander', 'squirtle'],
    hostCallout: 'Char! Rambut wangi!',
    effectType: 'foam',
    narration:
      'Keempat, SYAMPU. Kita menggunakan syampu untuk mencuci rambut supaya bersih dan berbau wangi.',
    checkpointTriggerSec: 34.7,
    checkpointId: 'cp-4',
  },
  {
    id: 'scene-6',
    number: 6,
    startSec: 35,
    endSec: 42,
    title: 'Perkataan 5: Sikat',
    targetWord: HYGIENE_WORD_MAP.sikat.word,
    syllables: HYGIENE_WORD_MAP.sikat.syllables,
    imageUrl: '/src/assets/images/hygiene_comb_hair_fixed_1795568641390.jpg',
    imageAlt: 'Murid menyikat rambut di hadapan cermin.',
    objectThumbUrl: HYGIENE_WORD_MAP.sikat.imageUrl,
    host: 'pikachu',
    companions: ['pikachu', 'bulbasaur', 'eevee'],
    hostCallout: 'Pika! Rambut kemas!',
    effectType: 'stars',
    narration:
      'Kelima, SIKAT. Kita menggunakan sikat untuk merapikan rambut agar sentiasa kemas.',
    checkpointTriggerSec: 41.3,
    checkpointId: 'cp-5',
  },
];

function formatSeconds(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
}

function getSceneIndexForTime(sec: number): number {
  const idx = BUILTIN_VIDEO_SCENES.findIndex(
    (s) => sec >= s.startSec && sec < s.endSec
  );
  return idx === -1 ? BUILTIN_VIDEO_SCENES.length - 1 : idx;
}

interface InteractiveHygieneVideoProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  elapsedSec: number;
  setElapsedSec: React.Dispatch<React.SetStateAction<number>>;
  isMuted: boolean;
  onToggleMute: () => void;
  hasActiveCheckpoint?: boolean;
  onTriggerCheckpoint?: (cp: VideoCheckpointQuestion) => void;
  triggeredCheckpoints?: string[];
  setTriggeredCheckpoints?: React.Dispatch<React.SetStateAction<string[]>>;
  onRequestFullscreen: () => void;
  enableCheckpoints?: boolean;
  onVideoEnded?: () => void;
}

export const InteractiveHygieneVideo: React.FC<InteractiveHygieneVideoProps> = ({
  isPlaying,
  setIsPlaying,
  elapsedSec,
  setElapsedSec,
  isMuted,
  onToggleMute,
  hasActiveCheckpoint = false,
  onTriggerCheckpoint,
  triggeredCheckpoints = [],
  setTriggeredCheckpoints,
  onRequestFullscreen,
  enableCheckpoints = true,
  onVideoEnded,
}) => {
  const [hasStartedOnce, setHasStartedOnce] = useState<boolean>(false);
  const [spokenProgressRatio, setSpokenProgressRatio] = useState<number>(0);

  const triggeredRef = useRef<string[]>(triggeredCheckpoints);
  triggeredRef.current = triggeredCheckpoints;

  // Refs to bridge synchronous click-initiated SpeechSynthesis with the active scene effect
  const prestartedSceneRef = useRef<number | null>(null);
  const activeBoundaryHandlerRef = useRef<(charIndex: number, totalChars: number) => void>(() => {});
  const activeEndHandlerRef = useRef<() => void>(() => {});

  const currentSceneIndex = getSceneIndexForTime(elapsedSec);
  const currentScene = BUILTIN_VIDEO_SCENES[currentSceneIndex];
  const isEnded = elapsedSec >= BUILTIN_VIDEO_DURATION;

  // Voiceover-Synchronized Scene Controller:
  // Locks the current scene's background & character stage strictly to its voiceover narration.
  // Only advances to the next scene (or pauses for the checkpoint) once the voiceover finishes!
  useEffect(() => {
    if (!isPlaying || hasActiveCheckpoint || isEnded) {
      return;
    }

    let cancelled = false;
    let speechFinished = false;
    let fallbackTimerId: number | null = null;
    let progressTimerId: number | null = null;

    const scene = BUILTIN_VIDEO_SCENES[currentSceneIndex];
    const sceneDurationSec = scene.endSec - scene.startSec;
    setElapsedSec(scene.startSec);
    setSpokenProgressRatio(0);

    const completeScene = () => {
      if (cancelled || speechFinished) return;
      speechFinished = true;
      if (fallbackTimerId !== null) window.clearTimeout(fallbackTimerId);
      if (progressTimerId !== null) window.clearInterval(progressTimerId);
      setSpokenProgressRatio(1);

      // Pause cleanly right AFTER the narration finishes if this scene has an unanswered checkpoint
      if (
        enableCheckpoints &&
        onTriggerCheckpoint &&
        scene.checkpointId &&
        !triggeredRef.current.includes(scene.checkpointId)
      ) {
        const cp = PHASE2_VIDEO_CHECKPOINTS.find((q) => q.id === scene.checkpointId);
        if (cp) {
          setElapsedSec(scene.checkpointTriggerSec ?? scene.endSec - 0.3);
          setIsPlaying(false);
          setTriggeredCheckpoints?.((prev) =>
            prev.includes(cp.id) ? prev : [...prev, cp.id]
          );
          onTriggerCheckpoint(cp);
          return;
        }
      }

      // Advance cleanly to the next scene (or end of video)
      if (currentSceneIndex + 1 < BUILTIN_VIDEO_SCENES.length) {
        setElapsedSec(BUILTIN_VIDEO_SCENES[currentSceneIndex + 1].startSec);
      } else {
        setElapsedSec(BUILTIN_VIDEO_DURATION);
        setIsPlaying(false);
        onVideoEnded?.();
      }
    };

    const estimatedMs = Math.max(4600, scene.narration.length * 76);
    const startWallTime = Date.now();
    let boundaryReceived = false;

    activeBoundaryHandlerRef.current = (charIndex: number, totalChars: number) => {
      if (cancelled || speechFinished || totalChars <= 0) return;
      boundaryReceived = true;
      const ratio = Math.min(0.96, Math.max(0, charIndex / totalChars));
      setSpokenProgressRatio(ratio);
      setElapsedSec(
        +(scene.startSec + ratio * (sceneDurationSec - 0.25)).toFixed(2)
      );
    };

    activeEndHandlerRef.current = () => {
      window.setTimeout(() => {
        completeScene();
      }, 320);
    };

    progressTimerId = window.setInterval(() => {
      if (cancelled || speechFinished || boundaryReceived) return;
      const ratio = Math.min(0.95, (Date.now() - startWallTime) / estimatedMs);
      setSpokenProgressRatio(ratio);
      setElapsedSec(
        +(scene.startSec + ratio * (sceneDurationSec - 0.25)).toFixed(2)
      );
    }, 120);

    const alreadyStartedByClick = prestartedSceneRef.current === currentSceneIndex;
    prestartedSceneRef.current = null;

    if (!isMuted && isSpeechSupported()) {
      if (currentSceneIndex + 1 < BUILTIN_VIDEO_SCENES.length) {
        prefetchMalaySpeech(BUILTIN_VIDEO_SCENES[currentSceneIndex + 1].narration);
      }

      if (!alreadyStartedByClick) {
        if (currentSceneIndex > 0) {
          playSceneTransitionTone();
        }
        speakMalay(scene.narration, {
          onBoundary: (charIndex, totalChars) =>
            activeBoundaryHandlerRef.current(charIndex, totalChars),
          onEnd: () => activeEndHandlerRef.current(),
        });
      }

      // Safety fallback timeout only if TTS stalls without firing onEnd
      fallbackTimerId = window.setTimeout(completeScene, estimatedMs + 7500);
    } else {
      // Muted or speech unsupported: run smoothly on the estimated scene cadence
      fallbackTimerId = window.setTimeout(completeScene, estimatedMs);
    }

    return () => {
      cancelled = true;
      if (fallbackTimerId !== null) window.clearTimeout(fallbackTimerId);
      if (progressTimerId !== null) window.clearInterval(progressTimerId);
      activeBoundaryHandlerRef.current = () => {};
      activeEndHandlerRef.current = () => {};
      stopSpeaking();
    };
  }, [
    isPlaying,
    hasActiveCheckpoint,
    isEnded,
    currentSceneIndex,
    isMuted,
    enableCheckpoints,
    setElapsedSec,
    setIsPlaying,
    setTriggeredCheckpoints,
    onTriggerCheckpoint,
    onVideoEnded,
  ]);

  // Prefetch first scene audio on mount and clean up speech on unmount
  useEffect(() => {
    if (!isMuted) {
      prefetchMalaySpeech(BUILTIN_VIDEO_SCENES[0].narration);
    }
    return () => {
      stopSpeaking();
    };
  }, [isMuted]);

  const triggerSpeechSynchronouslyForScene = (sceneIdx: number) => {
    if (isMuted || !isSpeechSupported()) return;
    const targetScene = BUILTIN_VIDEO_SCENES[sceneIdx];
    if (!targetScene) return;
    prestartedSceneRef.current = sceneIdx;
    speakMalay(targetScene.narration, {
      onBoundary: (charIndex, totalChars) =>
        activeBoundaryHandlerRef.current(charIndex, totalChars),
      onEnd: () => activeEndHandlerRef.current(),
    });
  };

  const handlePlayPress = () => {
    unlockAudioContext();
    playVideoStartJingle();
    setHasStartedOnce(true);

    const targetSceneIdx = isEnded ? 0 : currentSceneIndex;
    if (isEnded) {
      setElapsedSec(0);
      setTriggeredCheckpoints?.([]);
    }
    triggerSpeechSynchronouslyForScene(targetSceneIdx);
    setIsPlaying(true);
  };

  const handlePausePress = () => {
    playClickPop();
    prestartedSceneRef.current = null;
    stopSpeaking();
    setIsPlaying(false);
  };

  const handleReplayPress = () => {
    unlockAudioContext();
    playVideoStartJingle();
    prestartedSceneRef.current = null;
    stopSpeaking();
    setHasStartedOnce(true);
    setElapsedSec(0);
    setTriggeredCheckpoints?.([]);
    triggerSpeechSynchronouslyForScene(0);
    setIsPlaying(true);
  };

  const handleSeek = (nextSec: number) => {
    prestartedSceneRef.current = null;
    stopSpeaking();
    setHasStartedOnce(true);
    const targetIdx = getSceneIndexForTime(nextSec);
    setElapsedSec(BUILTIN_VIDEO_SCENES[targetIdx].startSec);
    setSpokenProgressRatio(0);
  };

  const progressPct = Math.min(100, (elapsedSec / BUILTIN_VIDEO_DURATION) * 100);

  // Highlight spoken progress across subtitle words for visual-to-voice sync
  const words = currentScene.narration.split(' ');
  const activeWordCutoff = isPlaying
    ? Math.max(1, Math.ceil(spokenProgressRatio * words.length))
    : words.length;

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 select-none">
      {/* 16:9 Visual Stage */}
      <div className="relative flex-1 overflow-hidden">
        {/* Moving Scene Background synchronized directly to active voiceover scene */}
        <AnimatePresence mode="sync">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <motion.div
              animate={
                isPlaying
                  ? {
                      scale: [1, 1.12, 1.07],
                      x: [0, -20, 14, 0],
                      y: [0, -8, 6, 0],
                    }
                  : { scale: 1.01, x: 0, y: 0 }
              }
              transition={{ duration: 6.5, repeat: isPlaying ? Infinity : 0, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              <ResilientImage
                src={currentScene.imageUrl}
                alt={currentScene.imageAlt}
                fallbackTitle={currentScene.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Subtle dark cinematic gradient for crisp readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-slate-950/55 pointer-events-none" />

        {/* Animated Bubbles / Sparkles / Effects Layer */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
              <motion.div
                key={`${currentScene.id}-fx-${idx}`}
                initial={{
                  opacity: 0,
                  y: 130 + idx * 14,
                  x: 24 + idx * 78,
                  scale: 0.6,
                }}
                animate={{
                  opacity: [0, 0.95, 0],
                  y: [-10, -180 - idx * 20],
                  x: [24 + idx * 78, 48 + idx * 78 + (idx % 2 === 0 ? 24 : -24)],
                  scale: [0.6, 1.25, 0.9],
                }}
                transition={{
                  duration: 2.3 + (idx % 4) * 0.4,
                  repeat: Infinity,
                  delay: idx * 0.3,
                  ease: 'easeOut',
                }}
                className="absolute bottom-16"
              >
                {currentScene.effectType === 'bubbles' || currentScene.effectType === 'foam' ? (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-sky-200/85 bg-white/35 backdrop-blur-xs shadow-sm" />
                ) : currentScene.effectType === 'sparkle-water' ? (
                  <div className="w-4 h-6 rounded-full bg-sky-300/85 border border-white shadow-sm" />
                ) : (
                  <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-yellow-300 drop-shadow" />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Top Scene Bar inside Video */}
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between gap-2 z-10">
          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-950/75 border border-white/15 px-3 py-1.5 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-white">
              Babak {currentScene.number}/6 · {currentScene.title}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-950/75 border border-white/15 px-2.5 py-1 backdrop-blur-xs">
            <CharacterAvatar character={currentScene.host} size="sm" />
            <span className="hidden sm:inline text-xs font-bold text-yellow-200">
              {CHARACTER_META[currentScene.host].name}
            </span>
            {isPlaying && !isMuted && (
              <span className="inline-flex items-end gap-0.5 h-3.5 px-1" aria-label="Suara latar aktif">
                <motion.span
                  animate={{ height: ['35%', '100%', '45%'] }}
                  transition={{ duration: 0.55, repeat: Infinity }}
                  className="w-1 bg-emerald-400 rounded-full"
                />
                <motion.span
                  animate={{ height: ['90%', '40%', '95%'] }}
                  transition={{ duration: 0.45, repeat: Infinity }}
                  className="w-1 bg-yellow-300 rounded-full"
                />
                <motion.span
                  animate={{ height: ['50%', '95%', '35%'] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="w-1 bg-sky-300 rounded-full"
                />
              </span>
            )}
          </div>
        </div>

        {/* Moving Animated Pokémon Characters on Stage */}
        {hasStartedOnce && !isEnded && (
          <div className="absolute bottom-24 sm:bottom-28 left-4 sm:left-8 right-4 z-10 pointer-events-none flex items-end justify-between gap-3">
            <div className="flex items-end gap-3 sm:gap-4">
              {currentScene.companions.map((charId, idx) => (
                <motion.div
                  key={`${currentScene.id}-${charId}`}
                  initial={{ opacity: 0, x: -40, y: 16, scale: 0.85 }}
                  animate={
                    isPlaying
                      ? {
                          opacity: 1,
                          x: [0, 26 + idx * 6, -8, 16, 0],
                          y: [0, -18, 0, -12, 0],
                          rotate: [-5, 6, -4, 4, 0],
                          scale: [1, 1.06, 0.98, 1.04, 1],
                        }
                      : { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }
                  }
                  transition={{
                    duration: 2.6,
                    repeat: isPlaying ? Infinity : 0,
                    delay: idx * 0.2,
                    ease: 'easeInOut',
                  }}
                  className="relative flex flex-col items-center"
                >
                  {idx === 0 && (
                    <motion.div
                      animate={isPlaying ? { y: [0, -6, 0], scale: [1, 1.05, 1] } : { y: 0 }}
                      transition={{ duration: 1.3, repeat: Infinity }}
                      className="mb-1.5 px-3 py-1 rounded-xl bg-yellow-300 border-2 border-slate-900 text-slate-900 text-[10px] sm:text-xs font-extrabold shadow-md whitespace-nowrap"
                    >
                      {currentScene.hostCallout}
                    </motion.div>
                  )}
                  <div className="p-1.5 rounded-2xl bg-white/95 border-2 border-yellow-400 shadow-xl">
                    <CharacterAvatar character={charId} size="lg" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Animated Target Object Pop-in */}
            {currentScene.objectThumbUrl && (
              <motion.div
                key={`${currentScene.id}-obj`}
                initial={{ opacity: 0, scale: 0.6, y: 16 }}
                animate={
                  isPlaying
                    ? { opacity: 1, scale: [1, 1.12, 1], y: [0, -14, 0], rotate: [-4, 5, -4] }
                    : { opacity: 1, scale: 1, y: 0, rotate: 0 }
                }
                transition={{ duration: 2.1, repeat: isPlaying ? Infinity : 0, ease: 'easeInOut' }}
                className="hidden sm:block w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white shadow-2xl bg-white shrink-0"
              >
                <ResilientImage
                  src={currentScene.objectThumbUrl}
                  alt={currentScene.targetWord || currentScene.title}
                  fallbackTitle={currentScene.targetWord || currentScene.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </div>
        )}

        {/* Central Start / Ended Overlay */}
        {(!hasStartedOnce || isEnded) && !hasActiveCheckpoint && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/45 backdrop-blur-[1px] p-4">
            <div className="text-center space-y-3 max-w-md">
              {isEnded ? (
                <>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 text-white shadow-lg mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                    Tahniah Pelatih! Video Interaktif Tamat!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200">
                    Kamu telah mempelajari kelima-lima perkataan kebersihan diri.
                  </p>
                  <button
                    type="button"
                    onClick={handleReplayPress}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-sm font-extrabold cursor-pointer shadow-md min-h-[44px]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Tonton Semula</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handlePlayPress}
                    aria-label="Mainkan Video"
                    className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-display text-base sm:text-lg font-extrabold shadow-xl cursor-pointer transition-transform hover:scale-105 min-h-[54px]"
                  >
                    <Play className="w-6 h-6 fill-current" />
                    <span>MAINKAN VIDEO</span>
                  </button>
                  <p className="text-xs sm:text-sm font-semibold text-white drop-shadow-xs">
                    {enableCheckpoints
                      ? 'Video beranimasi dengan suara latar dan watak Pokémon bergerak serta 5 soalan automatik!'
                      : 'Video beranimasi dengan suara latar Bahasa Melayu dan watak Pokémon bergerak!'}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Bottom Word Card + Synchronized Malay Subtitle Overlay */}
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 z-10 pointer-events-none">
          {/* Subtitle / Sari Kata with spoken-progress emphasis */}
          <div className="flex-1 rounded-2xl bg-slate-950/80 border border-white/15 px-3.5 py-2.5 sm:px-4 sm:py-3 backdrop-blur-xs">
            <p className="text-xs sm:text-sm md:text-base font-bold leading-snug">
              {words.map((w, idx) => (
                <span
                  key={`${currentScene.id}-w-${idx}`}
                  className={
                    idx < activeWordCutoff
                      ? 'text-yellow-200 transition-colors duration-150'
                      : 'text-white/80 transition-colors duration-150'
                  }
                >
                  {w}
                  {idx < words.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
          </div>

          {/* Highlighted Target Word Card */}
          {currentScene.targetWord && (
            <div className="self-start sm:self-end rounded-2xl bg-white/95 border-2 border-yellow-400 px-3.5 py-2 shadow-lg flex items-center gap-2.5 shrink-0">
              {currentScene.objectThumbUrl && (
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                  <ResilientImage
                    src={currentScene.objectThumbUrl}
                    alt={currentScene.targetWord}
                    fallbackTitle={currentScene.targetWord}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-display text-sm sm:text-base font-extrabold text-slate-900 leading-none">
                  {currentScene.targetWord}
                </p>
                {currentScene.syllables && (
                  <p className="text-[11px] font-bold text-sky-700 mt-1">
                    {currentScene.syllables}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Built-in Player Scrubber & Compact Controls */}
      <div className="bg-slate-900 border-t border-slate-800 px-3 sm:px-4 py-2.5 space-y-2 z-10">
        {/* Progress Scrubber */}
        <div className="relative flex items-center gap-2.5">
          <span className="text-[11px] font-bold text-slate-300 tabular-nums w-9 shrink-0">
            {formatSeconds(elapsedSec)}
          </span>
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min={0}
              max={BUILTIN_VIDEO_DURATION}
              step={0.5}
              value={elapsedSec}
              onChange={(e) => handleSeek(Number(e.target.value))}
              aria-label="Garis masa video interaktif"
              className="w-full accent-yellow-400 cursor-pointer h-1.5"
            />
            <div className="sr-only">Kemajuan {Math.round(progressPct)}%</div>
          </div>
          <span className="text-[11px] font-bold text-slate-400 tabular-nums w-9 text-right shrink-0">
            {formatSeconds(BUILTIN_VIDEO_DURATION)}
          </span>
        </div>

        {/* Transport Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <button
                type="button"
                onClick={handlePlayPress}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer min-h-[34px]"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isEnded ? 'Ulang' : 'Mainkan Video'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePausePress}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer min-h-[34px]"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Jeda</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleReplayPress}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer min-h-[34px]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-yellow-300" />
              <span>Mula Semula</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!isMuted) {
                  prestartedSceneRef.current = null;
                  stopSpeaking();
                }
                onToggleMute();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer min-h-[34px]"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-red-400" />
                  <span>Suara Senyap</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Suara Latar</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onRequestFullscreen}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer min-h-[34px]"
            >
              <Maximize className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Skrin Penuh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
