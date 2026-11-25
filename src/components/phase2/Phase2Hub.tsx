import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Compass,
  Link2,
  Loader2,
  Maximize,
  MessageCircle,
  Pause,
  Play,
  PlayCircle,
  RotateCcw,
  Send,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { HERO_MEDIA } from '../../data/phase1Data';
import {
  getPikachuSimulationReply,
  HYGIENE_OBJECTS,
  PHASE2_VIDEO_CHECKPOINTS,
  PIKACHU_AI_PRESET_PROMPTS,
} from '../../data/phases2to5Data';
import {
  HygieneWordKey,
  Phase2ProgressState,
  VideoCheckpointQuestion,
} from '../../types/learning';
import {
  playClickPop,
  playSuccessChime,
  playTryAgainTone,
  speakMalay,
  stopSpeaking,
} from '../../utils/audio';
import { CharacterDialogue } from '../CharacterDialogue';
import { PhaseMissionHubHeader, PhasePartConfig } from '../PhaseMissionHubHeader';
import {
  CHARACTER_META,
  CharacterAvatar,
  LightningEnergyIcon,
  PokeBallIcon,
  ResilientImage,
  UltraBallIcon,
} from '../PokemonIcons';
import { BUILTIN_VIDEO_DURATION, InteractiveHygieneVideo } from './InteractiveHygieneVideo';

interface Phase2HubProps {
  progress: Phase2ProgressState;
  onMarkIntroWord: (wordKey: HygieneWordKey) => void;
  onSaveVideoUrl: (url: string) => void;
  onMarkCheckpoint: (checkpointId: string) => void;
  onMarkExploreObject: (wordKey: HygieneWordKey) => void;
  onChatInteraction: () => void;
  onBackPhase1: () => void;
  onNextPhase3: () => void;
}

type Phase2Tab = 'A' | 'B' | 'C' | 'D';

interface ChatMessage {
  id: string;
  sender: 'pikachu' | 'student';
  text: string;
}

function getYouTubeOrVimeoEmbed(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
    }
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) return rawUrl;
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
    }
    if (parsed.hostname.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export const Phase2Hub: React.FC<Phase2HubProps> = ({
  progress,
  onMarkIntroWord,
  onSaveVideoUrl,
  onMarkCheckpoint,
  onMarkExploreObject,
  onChatInteraction,
  onBackPhase1,
  onNextPhase3,
}) => {
  const [activeTab, setActiveTab] = useState<Phase2Tab>('A');
  const [animatedWordKey, setAnimatedWordKey] = useState<HygieneWordKey | null>(null);
  const [selectedExploreKey, setSelectedExploreKey] = useState<HygieneWordKey>('sabun');

  // Bahagian B Interactive Video state
  const [uploadedBlobUrl, setUploadedBlobUrl] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>(progress.videoUrl);
  const [urlError, setUrlError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeCheckpoint, setActiveCheckpoint] = useState<VideoCheckpointQuestion | null>(null);
  const [checkpointSelectedOpt, setCheckpointSelectedOpt] = useState<string>('');
  const [checkpointResult, setCheckpointResult] = useState<'correct' | 'wrong' | null>(null);
  const [triggeredAutoCheckpoints, setTriggeredAutoCheckpoints] = useState<string[]>([]);

  // Built-in interactive video state (default playable video in Bahagian B)
  const [builtInPlaying, setBuiltInPlaying] = useState<boolean>(false);
  const [builtInElapsedSec, setBuiltInElapsedSec] = useState<number>(0);
  const [builtInMuted, setBuiltInMuted] = useState<boolean>(false);
  const [builtInVolume, setBuiltInVolume] = useState<number>(85);
  const [builtInTriggeredCheckpoints, setBuiltInTriggeredCheckpoints] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerWrapperRef = useRef<HTMLDivElement | null>(null);

  // Bahagian D Pikachu AI Chatbot state
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'pikachu',
      text: 'Pika Pika! Saya Pikachu AI, rakan belajar kamu. Tanya saya apa-apa sahaja tentang sabun, berus gigi, tuala, syampu atau sikat!',
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setUrlInput(progress.videoUrl);
  }, [progress.videoUrl]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  useEffect(() => {
    return () => {
      if (uploadedBlobUrl) URL.revokeObjectURL(uploadedBlobUrl);
      stopSpeaking();
    };
  }, [uploadedBlobUrl]);

  const activeVideoSrc = uploadedBlobUrl || progress.videoUrl.trim();
  const embedSrc = activeVideoSrc && !uploadedBlobUrl ? getYouTubeOrVimeoEmbed(activeVideoSrc) : null;
  const isDirectVideo = Boolean(activeVideoSrc && !embedSrc);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = Math.max(0, Math.min(1, volume / 100));
    el.muted = isMuted || volume === 0;
  }, [activeVideoSrc, volume, isMuted]);

  const handleSelectPart = (part: Phase2Tab) => {
    playClickPop();
    if (part !== 'B') {
      setBuiltInPlaying(false);
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      stopSpeaking();
    }
    setActiveTab(part);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Part A: Tap word card
  const handleTapIntroWord = (wordKey: HygieneWordKey, speakText: string) => {
    setAnimatedWordKey(wordKey);
    onMarkIntroWord(wordKey);
    speakMalay(speakText);
    setTimeout(() => setAnimatedWordKey((curr) => (curr === wordKey ? null : curr)), 600);
  };

  // Part B: Video Handlers
  const handleApplyVideoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setUrlError('Sila masukkan pautan video yang sah.');
      return;
    }
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        setUrlError('Pautan mesti bermula dengan http:// atau https://.');
        return;
      }
      setUrlError('');
      if (uploadedBlobUrl) {
        URL.revokeObjectURL(uploadedBlobUrl);
        setUploadedBlobUrl('');
        setUploadedFileName('');
      }
      onSaveVideoUrl(trimmed);
      setTriggeredAutoCheckpoints([]);
      playClickPop();
    } catch {
      setUrlError('Format pautan tidak sah. Contoh: https://www.youtube.com/watch?v=...');
    }
  };

  const handleUploadVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('video/')) {
      setUrlError('Sila pilih fail video yang sah (contoh: .mp4, .webm).');
      return;
    }
    setUrlError('');
    if (uploadedBlobUrl) URL.revokeObjectURL(uploadedBlobUrl);
    const nextUrl = URL.createObjectURL(file);
    setUploadedBlobUrl(nextUrl);
    setUploadedFileName(file.name);
    setTriggeredAutoCheckpoints([]);
    playClickPop();
  };

  const handleClearVideo = () => {
    if (uploadedBlobUrl) URL.revokeObjectURL(uploadedBlobUrl);
    setUploadedBlobUrl('');
    setUploadedFileName('');
    setUrlInput('');
    onSaveVideoUrl('');
    setIsPlaying(false);
    setActiveCheckpoint(null);
    setTriggeredAutoCheckpoints([]);
    setBuiltInPlaying(false);
    setBuiltInElapsedSec(0);
    setBuiltInTriggeredCheckpoints([]);
    stopSpeaking();
  };

  const openCheckpointModal = (cp: VideoCheckpointQuestion) => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setBuiltInPlaying(false);
    stopSpeaking();
    setActiveCheckpoint(cp);
    setCheckpointSelectedOpt('');
    setCheckpointResult(null);
    playClickPop();
  };

  const handleVideoTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || !el.duration || el.duration < 2 || activeCheckpoint) return;
    const pct = (el.currentTime / el.duration) * 100;
    const nextCp = PHASE2_VIDEO_CHECKPOINTS.find(
      (cp) => pct >= cp.triggerPercent && !triggeredAutoCheckpoints.includes(cp.id)
    );
    if (nextCp) {
      setTriggeredAutoCheckpoints((prev) => [...prev, nextCp.id]);
      openCheckpointModal(nextCp);
    }
  };

  const handleAnswerCheckpoint = (option: string) => {
    if (!activeCheckpoint) return;
    setCheckpointSelectedOpt(option);
    if (option === activeCheckpoint.correctAnswer) {
      setCheckpointResult('correct');
      onMarkCheckpoint(activeCheckpoint.id);
      playSuccessChime();
    } else {
      setCheckpointResult('wrong');
      playTryAgainTone();
    }
  };

  const handleResumeAfterCheckpoint = () => {
    const currentCp = activeCheckpoint;
    setActiveCheckpoint(null);
    setCheckpointSelectedOpt('');
    setCheckpointResult(null);
    if (isDirectVideo && videoRef.current) {
      videoRef.current.volume = Math.max(0, Math.min(1, volume / 100));
      videoRef.current.muted = isMuted || volume === 0;
      videoRef.current.play().catch(() => setIsPlaying(false));
    } else if (!activeVideoSrc) {
      if (currentCp?.id === 'cp-5' && builtInElapsedSec >= 41) {
        setBuiltInElapsedSec(BUILTIN_VIDEO_DURATION);
        setBuiltInPlaying(false);
      } else {
        setBuiltInPlaying(true);
      }
    }
  };

  // Part D: Real Gemini Chatbot Handler
  const handleSendChat = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isChatLoading) return;
    playClickPop();
    setChatError('');

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'student',
      text: trimmed,
    };

    const historyForApi = chatMessages.filter((m) => m.id !== 'welcome-msg');
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/pikachu-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: historyForApi,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };

      if (!response.ok || !data.reply) {
        const fallback = getPikachuSimulationReply(trimmed);
        setChatMessages((prev) => [
          ...prev,
          { id: `p-${Date.now() + 1}`, sender: 'pikachu', text: fallback.text },
        ]);
        onChatInteraction();
        playSuccessChime();
        return;
      }

      const botMsg: ChatMessage = {
        id: `p-${Date.now() + 1}`,
        sender: 'pikachu',
        text: data.reply,
      };
      setChatMessages((prev) => [...prev, botMsg]);
      onChatInteraction();
      playSuccessChime();
    } catch {
      const fallback = getPikachuSimulationReply(trimmed);
      setChatMessages((prev) => [
        ...prev,
        { id: `p-${Date.now() + 1}`, sender: 'pikachu', text: fallback.text },
      ]);
      onChatInteraction();
      playSuccessChime();
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleResetChat = () => {
    playClickPop();
    setChatError('');
    setChatMessages([
      {
        id: 'welcome-msg',
        sender: 'pikachu',
        text: 'Pika Pika! Saya Pikachu AI, rakan belajar kamu. Tanya saya apa-apa sahaja tentang sabun, berus gigi, tuala, syampu atau sikat!',
      },
    ]);
  };

  const selectedExploreObj =
    HYGIENE_OBJECTS.find((obj) => obj.key === selectedExploreKey) || HYGIENE_OBJECTS[0];

  const partsConfig: PhasePartConfig<Phase2Tab>[] = [
    {
      id: 'A',
      code: 'Bahagian A',
      title: 'Kenali Perkataan',
      subtitle: '5 kad perkataan & audio',
      icon: <Sparkles className="w-5 h-5 text-sky-600" />,
      completed: progress.introWordsClicked.length >= 5,
    },
    {
      id: 'B',
      code: 'Bahagian B',
      title: 'Video Interaktif',
      subtitle: 'Video & 5 soalan hentian',
      icon: <PlayCircle className="w-5 h-5 text-red-600" />,
      completed: progress.checkpointsAnswered.length >= 5,
    },
    {
      id: 'C',
      code: 'Bahagian C',
      title: 'Teroka Pokémon',
      subtitle: '5 objek kebersihan diri',
      icon: <Compass className="w-5 h-5 text-emerald-600" />,
      completed: progress.exploreObjectsClicked.length >= 5,
    },
    {
      id: 'D',
      code: 'Bahagian D',
      title: 'Pikachu AI',
      subtitle: 'Soal jawab rakan belajar',
      icon: <Bot className="w-5 h-5 text-amber-600" />,
      completed: progress.chatInteractions >= 1,
    },
  ];

  return (
    <div className="space-y-8 pb-14">
      {/* Phase 2 Mission Header & Progress Tracker (matches Misi 1) */}
      <PhaseMissionHubHeader
        phaseEyebrow="Fasa 2 · Pengenalan & Penerokaan Perkataan"
        missionTitle="MISI 2: KENALI PERKATAAN"
        progressLabel="Kemajuan Fasa 2"
        parts={partsConfig}
        activePart={activeTab}
        onSelectPart={handleSelectPart}
        allCompletedAction={{
          label: 'Ke Misi 3',
          onClick: onNextPhase3,
        }}
      />

      {/* Active Activity Canvas (matches Misi 1) */}
      <section className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-8 shadow-sm">
        {/* BAHAGIAN A: PENGENALAN PERKATAAN */}
        {activeTab === 'A' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-sky-700 mb-1">
                  Aktiviti A · Pengenalan Perkataan
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  KENALI LIMA PERKATAAN!
                </h2>
              </div>
              <div className="text-sm font-semibold text-slate-700 tabular-nums">
                Perkataan diteroka:{' '}
                <span className="text-sky-700 font-bold">
                  {progress.introWordsClicked.length} / 5
                </span>
              </div>
            </div>

            <CharacterDialogue
              character="pikachu"
              message="Jom kenali lima perkataan penting untuk menjaga kebersihan diri!"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {HYGIENE_OBJECTS.map((item) => {
                const isClicked = progress.introWordsClicked.includes(item.key);
                const isAnimating = animatedWordKey === item.key;

                return (
                  <motion.div
                    key={item.key}
                    animate={isAnimating ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35 }}
                    onClick={() => handleTapIntroWord(item.key, `${item.word}. ${item.usageDescription}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTapIntroWord(item.key, `${item.word}. ${item.usageDescription}`);
                      }
                    }}
                    className={`rounded-2xl border overflow-hidden cursor-pointer transition-all flex flex-col justify-between bg-white ${
                      isClicked
                        ? 'border-emerald-300 shadow-sm hover:border-emerald-400'
                        : 'border-slate-200 hover:border-sky-400 hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-100">
                      <ResilientImage
                        src={item.imageUrl}
                        alt={item.imageAlt}
                        fallbackTitle={item.word}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-2xl font-extrabold text-slate-900 tracking-wide">
                            {item.word}
                          </h3>
                          {isClicked && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs font-bold text-sky-700">Suku kata: {item.syllables}</p>
                        <p className="text-sm text-slate-700 leading-relaxed pt-1">
                          {item.usageDescription}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTapIntroWord(item.key, `${item.word}. ${item.usageDescription}`);
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 text-slate-900 text-xs font-bold transition-colors cursor-pointer min-h-[42px]"
                      >
                        <Volume2 className="w-4 h-4 text-amber-800" />
                        <span>Dengar Sebutan</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 flex items-center gap-3.5">
              <CharacterAvatar character="squirtle" size="sm" />
              <p className="text-sm text-slate-800">
                <span className="font-bold text-sky-800">Squirtle:</span> Tekan kesemua lima kad di atas untuk mendengar sebutan dan mengenali kegunaan setiap objek kebersihan!
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className={`w-6 h-6 shrink-0 ${
                    progress.introWordsClicked.length >= 5 ? 'text-emerald-600' : 'text-sky-600'
                  }`}
                />
                <div>
                  <p className="font-display text-base font-bold text-slate-900">
                    {progress.introWordsClicked.length >= 5
                      ? 'Hebat Pelatih! Semua 5 perkataan telah diteroka!'
                      : 'Teroka kelima-lima kad perkataan sebelum ke aktiviti seterusnya.'}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Seterusnya, tonton video interaktif bersama Pokémon.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPart('B')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                <span>Ke Bahagian B: Video Interaktif</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* BAHAGIAN B: VIDEO INTERAKTIF */}
        {activeTab === 'B' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-red-700 mb-1">
                  Aktiviti B · Video Interaktif
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  JOM BERSIHKAN DIRI BERSAMA POKÉMON!
                </h2>
              </div>
              <div className="text-sm font-semibold text-slate-700 tabular-nums">
                Soalan video dijawab:{' '}
                <span className="font-bold text-emerald-700">
                  {progress.checkpointsAnswered.length} / 5
                </span>
              </div>
            </div>

            <CharacterDialogue
              character="pikachu"
              message="Tonton video dengan teliti dan jawab kelima-lima soalan hentian apabila video berhenti seketika!"
            />

            {/* 16:9 Interactive Video Stage */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <div
                ref={playerWrapperRef}
                className="relative min-h-[340px] sm:min-h-0 sm:aspect-video w-full bg-slate-950 overflow-hidden"
              >
                {!activeVideoSrc ? (
                  <InteractiveHygieneVideo
                    isPlaying={builtInPlaying}
                    setIsPlaying={setBuiltInPlaying}
                    elapsedSec={builtInElapsedSec}
                    setElapsedSec={setBuiltInElapsedSec}
                    isMuted={builtInMuted}
                    onToggleMute={() => setBuiltInMuted((prev) => !prev)}
                    volume={builtInVolume}
                    onVolumeChange={setBuiltInVolume}
                    hasActiveCheckpoint={Boolean(activeCheckpoint)}
                    onTriggerCheckpoint={(cp) => {
                      setActiveCheckpoint(cp);
                      setCheckpointSelectedOpt('');
                      setCheckpointResult(null);
                    }}
                    triggeredCheckpoints={builtInTriggeredCheckpoints}
                    setTriggeredCheckpoints={setBuiltInTriggeredCheckpoints}
                    onRequestFullscreen={() =>
                      playerWrapperRef.current?.requestFullscreen?.().catch(() => {})
                    }
                  />
                ) : embedSrc ? (
                  <iframe
                    src={embedSrc}
                    title="Jom Bersihkan Diri Bersama Pokémon"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={activeVideoSrc}
                    poster={HERO_MEDIA.videoPosterImage}
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain bg-slate-950"
                    onLoadedMetadata={(e) => {
                      e.currentTarget.volume = Math.max(0, Math.min(1, volume / 100));
                      e.currentTarget.muted = isMuted || volume === 0;
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onVolumeChange={(e) => {
                      const el = e.currentTarget;
                      setIsMuted(el.muted || el.volume === 0);
                      setVolume(Math.round(el.volume * 100));
                    }}
                    onTimeUpdate={handleVideoTimeUpdate}
                  />
                )}

                {/* Interactive Checkpoint Question Overlay */}
                {activeCheckpoint && (
                  <div className="absolute inset-0 z-20 bg-slate-900/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-sky-700">
                          Soalan Interaktif {activeCheckpoint.number} / 5
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveCheckpoint(null)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          Tutup
                        </button>
                      </div>

                      <h4 className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
                        {activeCheckpoint.question}
                      </h4>

                      <div className="grid grid-cols-1 gap-2.5">
                        {activeCheckpoint.options.map((opt) => {
                          const isPicked = checkpointSelectedOpt === opt;
                          const isCorrectOpt = opt === activeCheckpoint.correctAnswer;
                          let cls = 'bg-slate-50 border-slate-200 hover:border-sky-400 text-slate-900';
                          if (isPicked && checkpointResult === 'correct' && isCorrectOpt) {
                            cls = 'bg-emerald-50 border-emerald-500 text-emerald-950';
                          } else if (isPicked && checkpointResult === 'wrong') {
                            cls = 'bg-red-50 border-red-400 text-red-900';
                          }

                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleAnswerCheckpoint(opt)}
                              className={`w-full text-left px-4 py-3 rounded-xl border font-semibold text-sm sm:text-base transition-colors cursor-pointer min-h-[46px] ${cls}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {checkpointResult === 'correct' && (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-sm font-semibold text-emerald-900 space-y-3">
                          <p>{activeCheckpoint.feedbackCorrect}</p>
                          <button
                            type="button"
                            onClick={handleResumeAfterCheckpoint}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold cursor-pointer min-h-[44px]"
                          >
                            <Play className="w-4 h-4" />
                            <span>Teruskan Video</span>
                          </button>
                        </div>
                      )}

                      {checkpointResult === 'wrong' && (
                        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-sm font-semibold text-amber-950">
                          {activeCheckpoint.feedbackWrong}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Video Controls & Checkpoint Trigger Strip */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
                {isDirectVideo && (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const el = videoRef.current;
                          if (!el) return;
                          el.volume = Math.max(0, Math.min(1, volume / 100));
                          el.muted = isMuted || volume === 0;
                          el.play().catch(() => setIsPlaying(false));
                        }}
                        disabled={isPlaying}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 disabled:bg-slate-200 disabled:text-slate-500 text-white text-xs font-bold cursor-pointer min-h-[40px]"
                      >
                        <Play className="w-4 h-4" />
                        <span>
                          {videoRef.current && videoRef.current.currentTime > 0 && !videoRef.current.ended
                            ? 'Sambung'
                            : 'Main'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          videoRef.current?.pause();
                        }}
                        disabled={!isPlaying}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 disabled:bg-slate-200 disabled:text-slate-500 text-white text-xs font-bold cursor-pointer min-h-[40px]"
                      >
                        <Pause className="w-4 h-4" />
                        <span>Jeda</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const el = videoRef.current;
                          if (!el) return;
                          el.currentTime = 0;
                          el.volume = Math.max(0, Math.min(1, volume / 100));
                          el.muted = isMuted || volume === 0;
                          setTriggeredAutoCheckpoints([]);
                          el.play().catch(() => setIsPlaying(false));
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-bold cursor-pointer min-h-[40px]"
                      >
                        <RotateCcw className="w-4 h-4 text-sky-600" />
                        <span>Ulang</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 min-h-[40px]">
                        <button
                          type="button"
                          onClick={() => {
                            const next = !isMuted;
                            setIsMuted(next);
                            if (videoRef.current) videoRef.current.muted = next;
                          }}
                          className="cursor-pointer"
                          aria-label="Tukar suara video"
                        >
                          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={isMuted ? 0 : volume}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            setVolume(v);
                            if (videoRef.current) {
                              videoRef.current.volume = v / 100;
                              videoRef.current.muted = v === 0;
                            }
                            setIsMuted(v === 0);
                          }}
                          className="w-20 accent-sky-600 cursor-pointer"
                          aria-label="Volum video"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => playerWrapperRef.current?.requestFullscreen?.().catch(() => {})}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 cursor-pointer min-h-[40px]"
                      >
                        <Maximize className="w-4 h-4" />
                        <span>Skrin Penuh</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 5 Interactive Checkpoint Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 mr-1">
                    Soalan Hentian Video:
                  </span>
                  {PHASE2_VIDEO_CHECKPOINTS.map((cp) => {
                    const answered = progress.checkpointsAnswered.includes(cp.id);
                    return (
                      <button
                        key={cp.id}
                        type="button"
                        onClick={() => openCheckpointModal(cp)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer min-h-[40px] ${
                          answered
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-white border-slate-300 text-slate-800 hover:border-sky-400'
                        }`}
                      >
                        {answered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>Soalan {cp.number}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Teacher Video URL / Upload Box */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700">
                  Ruang Guru (Pilihan): Guna Video Sendiri {uploadedFileName ? `(${uploadedFileName})` : ''}
                </p>
                <p className="text-xs text-slate-600">
                  Video interaktif binaan dalam sudah sedia dimainkan di atas. Guru juga boleh memasukkan pautan YouTube atau memuat naik fail video sendiri jika mahu.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                <form onSubmit={handleApplyVideoUrl} className="lg:col-span-7 flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Tampal pautan YouTube atau MP4..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm min-h-[44px]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer min-h-[44px] whitespace-nowrap"
                  >
                    Guna Pautan
                  </button>
                </form>

                <div className="lg:col-span-5 flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sky-300 bg-white hover:bg-sky-50 text-sky-800 text-xs font-bold cursor-pointer min-h-[44px]">
                    <Upload className="w-4 h-4" />
                    <span>Muat Naik Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleUploadVideoFile}
                      className="hidden"
                    />
                  </label>

                  {activeVideoSrc && (
                    <button
                      type="button"
                      onClick={handleClearVideo}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-red-200 bg-white text-red-700 text-xs font-bold cursor-pointer min-h-[44px]"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Guna Video Binaan Dalam</span>
                    </button>
                  )}
                </div>
              </div>
              {urlError && <p className="text-xs font-semibold text-red-600">{urlError}</p>}
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 flex items-center gap-3.5">
              <CharacterAvatar character="charmander" size="sm" />
              <p className="text-sm text-slate-800">
                <span className="font-bold text-amber-800">Charmander:</span> Tekan butang Main pada video di atas! Video akan berhenti seketika secara automatik untuk setiap soalan interaktif.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className={`w-6 h-6 shrink-0 ${
                    progress.checkpointsAnswered.length >= 5 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                />
                <div>
                  <p className="font-display text-base font-bold text-slate-900">
                    {progress.checkpointsAnswered.length >= 5
                      ? 'Tahniah! Semua 5 soalan hentian video telah dijawab!'
                      : 'Selesaikan soalan hentian video sebelum meneroka bersama rakan Pokémon.'}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Langkah seterusnya: Teroka Bersama Pokémon.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPart('C')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                <span>Ke Bahagian C: Teroka Pokémon</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* BAHAGIAN C: TEROKA BERSAMA POKÉMON */}
        {activeTab === 'C' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-700 mb-1">
                  Aktiviti C · Teroka Bersama Pokémon
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  TEROKA OBJEK KEBERSIHAN!
                </h2>
              </div>
              <div className="text-sm font-semibold text-slate-700 tabular-nums">
                Objek diteroka:{' '}
                <span className="font-bold text-emerald-700">
                  {progress.exploreObjectsClicked.length} / 5
                </span>
              </div>
            </div>

            <CharacterDialogue
              character="pikachu"
              message="Klik setiap objek kebersihan diri di bawah untuk mengetahui kegunaannya bersama Pikachu, Squirtle, Bulbasaur dan Charmander!"
            />

            {/* 5 Object Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {HYGIENE_OBJECTS.map((obj) => {
                const isSelected = selectedExploreObj.key === obj.key;
                const isExplored = progress.exploreObjectsClicked.includes(obj.key);

                return (
                  <button
                    key={obj.key}
                    type="button"
                    onClick={() => {
                      playClickPop();
                      setSelectedExploreKey(obj.key);
                      onMarkExploreObject(obj.key);
                    }}
                    className={`rounded-2xl border p-3 text-center transition-all cursor-pointer flex flex-col items-center gap-2.5 ${
                      isSelected
                        ? 'bg-yellow-50 border-yellow-400 ring-1 ring-yellow-400 shadow-xs'
                        : isExplored
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-sky-300'
                    }`}
                  >
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-slate-100">
                      <ResilientImage
                        src={obj.imageUrl}
                        alt={obj.imageAlt}
                        fallbackTitle={obj.word}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-sm font-extrabold text-slate-900">
                        {obj.word}
                      </span>
                      {isExplored && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Focused Malay Reading & Companion Display */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <ResilientImage
                  src={selectedExploreObj.imageUrl}
                  alt={selectedExploreObj.imageAlt}
                  fallbackTitle={selectedExploreObj.word}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-sky-700">
                      Suku Kata: {selectedExploreObj.syllables}
                    </p>
                    <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-0.5">
                      {selectedExploreObj.word}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      speakMalay(
                        `${selectedExploreObj.word}. ${selectedExploreObj.usageDescription} ${selectedExploreObj.exampleSentence}`
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer min-h-[44px]"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Dengar Perkataan</span>
                  </button>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-1.5">
                  <p className="text-base font-bold text-slate-900">
                    Kegunaan: {selectedExploreObj.usageDescription}
                  </p>
                  <p className="text-sm text-slate-700">
                    Contoh ayat: {selectedExploreObj.exampleSentence}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3.5">
                  <CharacterAvatar character={selectedExploreObj.companion} size="md" />
                  <div>
                    <p className="text-xs font-bold text-slate-500">
                      Pembantu: {CHARACTER_META[selectedExploreObj.companion].name}
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedExploreObj.companionGreeting}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center gap-3.5">
              <CharacterAvatar character="bulbasaur" size="sm" />
              <p className="text-sm text-slate-800">
                <span className="font-bold text-emerald-800">Bulbasaur:</span> Baca suku kata perkataan dengan perlahan dan jelas supaya kamu mudah mengingat setiap perkataan.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className={`w-6 h-6 shrink-0 ${
                    progress.exploreObjectsClicked.length >= 5 ? 'text-emerald-600' : 'text-sky-600'
                  }`}
                />
                <div>
                  <p className="font-display text-base font-bold text-slate-900">
                    {progress.exploreObjectsClicked.length >= 5
                      ? 'Bagus Pelatih! Semua 5 objek telah diteroka!'
                      : 'Teroka kelima-lima objek kebersihan diri di atas.'}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Seterusnya, berinteraksi dengan Pikachu AI – Rakan Belajar.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPart('D')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                <span>Ke Bahagian D: Pikachu AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* BAHAGIAN D: PIKACHU AI – RAKAN BELAJAR (CHATBOT GEMINI) */}
        {activeTab === 'D' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-amber-700 mb-1">
                  Aktiviti D · Chatbot Pintar Bahasa Melayu
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  PIKACHU AI – RAKAN BELAJAR!
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-slate-700 tabular-nums">
                  Soalan ditanya:{' '}
                  <span className="font-bold text-amber-700">{progress.chatInteractions}</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetChat}
                  disabled={isChatLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 text-xs font-bold text-slate-800 cursor-pointer min-h-[40px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Bual Baharu</span>
                </button>
              </div>
            </div>

            <CharacterDialogue
              character="pikachu"
              message="Hai Pelatih! Saya chatbot Pikachu AI. Tanya saya apa sahaja tentang cara membaca, suku kata atau kegunaan objek kebersihan diri!"
            />

            {/* Preset Year 2 Question Chips */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-600">
                Pilih soalan cepat atau taip soalan kamu sendiri di bawah:
              </p>
              <div className="flex flex-wrap gap-2">
                {PIKACHU_AI_PRESET_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    disabled={isChatLoading}
                    onClick={() => handleSendChat(prompt.label)}
                    className="px-3.5 py-2 rounded-xl border border-yellow-300 bg-yellow-50 hover:bg-yellow-100 disabled:opacity-50 text-slate-900 text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[40px]"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Conversation Box */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-4 max-h-[400px] overflow-y-auto">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.sender === 'student' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'pikachu' && <CharacterAvatar character="pikachu" size="sm" />}
                  <div
                    className={`max-w-lg rounded-2xl px-4 py-3 text-sm sm:text-base leading-relaxed space-y-2 ${
                      msg.sender === 'student'
                        ? 'bg-sky-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-900'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    {msg.sender === 'pikachu' && (
                      <button
                        type="button"
                        onClick={() => speakMalay(msg.text)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dengar Suara Pikachu</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <CharacterAvatar character="pikachu" size="sm" />
                  <div className="rounded-2xl px-4 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-semibold inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                    <span>Pikachu sedang menaip jawapan...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {chatError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm font-semibold text-red-800">
                {chatError}
              </div>
            )}

            {/* Text Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat(chatInput);
              }}
              className="flex flex-col sm:flex-row gap-2.5"
            >
              <div className="relative flex-1">
                <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={chatInput}
                  disabled={isChatLoading}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Taip soalan kepada Pikachu (contoh: Bagaimana nak eja syampu?)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white disabled:bg-slate-100 text-sm text-slate-900 min-h-[48px] focus:outline-none focus:border-sky-600"
                />
              </div>
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold cursor-pointer min-h-[48px] whitespace-nowrap"
              >
                {isChatLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LightningEnergyIcon className="w-4 h-4" />
                )}
                <span>Tanya Pikachu</span>
              </button>
            </form>

            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 flex items-center gap-3.5">
              <CharacterAvatar character="squirtle" size="sm" />
              <p className="text-sm text-slate-800">
                <span className="font-bold text-sky-800">Squirtle:</span> Cuba tanya Pikachu tentang maksud perkataan atau contoh ayat mudah untuk setiap objek kebersihan.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Phase 2 Bottom Navigation (matches Misi 1) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackPhase1}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold cursor-pointer min-h-[46px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <PokeBallIcon className="w-4 h-4" />
          <span>Kembali ke Misi 1</span>
        </button>

        <button
          type="button"
          onClick={onNextPhase3}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-extrabold transition-colors cursor-pointer min-h-[46px]"
        >
          <UltraBallIcon className="w-4 h-4" />
          <span>Seterusnya: Misi 3 (Cabaran Pokémon)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
