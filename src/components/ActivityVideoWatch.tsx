import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Link2,
  Maximize,
  Pause,
  Play,
  RotateCcw,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { HERO_MEDIA, TARGET_WORDS, VIDEO_STORYBOARD } from '../data/phase1Data';
import { playClickPop, playSuccessChime, speakMalay } from '../utils/audio';
import { CharacterDialogue } from './CharacterDialogue';
import { InteractiveHygieneVideo } from './phase2/InteractiveHygieneVideo';
import { CharacterAvatar } from './PokemonIcons';

interface ActivityVideoWatchProps {
  teacherVideoUrl: string;
  missionCompleted: boolean;
  learnedWordIds: string[];
  onSaveVideoUrl: (url: string) => void;
  onMarkWordLearned: (wordId: string) => void;
  onCompleteMission: () => void;
  onNextMission: () => void;
}

function getYouTubeEmbedUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}?rel=0&enablejsapi=1` : null;
    }
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) {
        return rawUrl;
      }
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}?rel=0&enablejsapi=1` : null;
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

export const ActivityVideoWatch: React.FC<ActivityVideoWatchProps> = ({
  teacherVideoUrl,
  missionCompleted,
  learnedWordIds,
  onSaveVideoUrl,
  onMarkWordLearned,
  onCompleteMission,
  onNextMission,
}) => {
  const [uploadedBlobUrl, setUploadedBlobUrl] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>(teacherVideoUrl);
  const [urlError, setUrlError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [activeWordId, setActiveWordId] = useState<string>(TARGET_WORDS[0].id);
  const [showTeacherPanel, setShowTeacherPanel] = useState<boolean>(false);
  const [builtInPlaying, setBuiltInPlaying] = useState<boolean>(false);
  const [builtInElapsedSec, setBuiltInElapsedSec] = useState<number>(0);
  const [builtInMuted, setBuiltInMuted] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setUrlInput(teacherVideoUrl);
  }, [teacherVideoUrl]);

  useEffect(() => {
    return () => {
      if (uploadedBlobUrl) {
        URL.revokeObjectURL(uploadedBlobUrl);
      }
    };
  }, [uploadedBlobUrl]);

  const activeSourceUrl = uploadedBlobUrl || teacherVideoUrl.trim();
  const embedUrl = activeSourceUrl && !uploadedBlobUrl ? getYouTubeEmbedUrl(activeSourceUrl) : null;
  const isDirectVideo = Boolean(activeSourceUrl && !embedUrl);

  const handleApplyUrl = (e: React.FormEvent) => {
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
      setIsPlaying(false);
      playClickPop();
    } catch {
      setUrlError('Format pautan tidak sah. Contoh: https://www.youtube.com/watch?v=...');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setUrlError('Sila pilih fail video yang sah (contoh: .mp4, .webm).');
      return;
    }
    setUrlError('');
    if (uploadedBlobUrl) {
      URL.revokeObjectURL(uploadedBlobUrl);
    }
    const nextBlobUrl = URL.createObjectURL(file);
    setUploadedBlobUrl(nextBlobUrl);
    setUploadedFileName(file.name);
    setIsPlaying(false);
    playClickPop();
  };

  const handleClearVideo = () => {
    if (uploadedBlobUrl) {
      URL.revokeObjectURL(uploadedBlobUrl);
    }
    setUploadedBlobUrl('');
    setUploadedFileName('');
    setUrlInput('');
    setUrlError('');
    onSaveVideoUrl('');
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePlay = () => {
    if (!videoRef.current) return;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
  };

  const handleReplay = () => {
    if (embedUrl) {
      setIframeKey((prev) => prev + 1);
      playClickPop();
      return;
    }
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
    playClickPop();
  };

  const handleVolumeChange = (nextVal: number) => {
    setVolume(nextVal);
    if (videoRef.current) {
      videoRef.current.volume = nextVal / 100;
      videoRef.current.muted = nextVal === 0;
    }
    setIsMuted(nextVal === 0);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  const handleFullscreen = () => {
    const target = playerContainerRef.current;
    if (!target) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (target.requestFullscreen) {
      target.requestFullscreen().catch(() => {});
    }
  };

  const handleWordSelect = (wordId: string, wordText: string) => {
    setActiveWordId(wordId);
    onMarkWordLearned(wordId);
    speakMalay(wordText);
  };

  const handleConfirmWatched = () => {
    onCompleteMission();
    playSuccessChime();
  };

  const activeWord = TARGET_WORDS.find((w) => w.id === activeWordId) || TARGET_WORDS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-red-700 mb-1">Aktiviti B · Tonton Video</p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            JOM TONTON VIDEO!
          </h2>
        </div>
        <div className="text-sm font-semibold text-slate-700">
          Tajuk Video: <span className="font-bold text-slate-900">AMALAN KEBERSIHAN DIRI</span>
        </div>
      </div>

      <CharacterDialogue
        character="pikachu"
        message="Pelatih, mari kita tonton video tentang amalan kebersihan diri!"
      />

      {/* 16:9 Video Player Stage */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div
          ref={playerContainerRef}
          className="relative min-h-[340px] sm:min-h-0 sm:aspect-video w-full bg-slate-950 overflow-hidden"
        >
          {!activeSourceUrl ? (
            /* Built-in Animated Pokémon Hygiene Video (plays immediately on click with voice + moving characters) */
            <InteractiveHygieneVideo
              isPlaying={builtInPlaying}
              setIsPlaying={setBuiltInPlaying}
              elapsedSec={builtInElapsedSec}
              setElapsedSec={setBuiltInElapsedSec}
              isMuted={builtInMuted}
              onToggleMute={() => setBuiltInMuted((prev) => !prev)}
              enableCheckpoints={false}
              onVideoEnded={() => {
                onCompleteMission();
                playSuccessChime();
              }}
              onRequestFullscreen={handleFullscreen}
            />
          ) : embedUrl ? (
            /* Embedded YouTube / Vimeo Player */
            <iframe
              key={iframeKey}
              src={embedUrl}
              title="Amalan Kebersihan Diri"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            /* Direct HTML5 Video File / MP4 Player */
            <video
              ref={videoRef}
              src={activeSourceUrl}
              poster={HERO_MEDIA.videoPosterImage}
              className="w-full h-full object-contain bg-slate-950"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false);
                onCompleteMission();
                playSuccessChime();
              }}
            />
          )}
        </div>

        {/* Custom Video Control Bar (shown when teacher supplies external video) */}
        {activeSourceUrl && (
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {isDirectVideo ? (
              <>
                <button
                  type="button"
                  onClick={handlePlay}
                  disabled={isPlaying}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors min-h-[40px] cursor-pointer ${
                    isPlaying
                      ? 'bg-slate-200 text-slate-500 cursor-default'
                      : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>Main</span>
                </button>
                <button
                  type="button"
                  onClick={handlePause}
                  disabled={!isPlaying}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors min-h-[40px] cursor-pointer ${
                    !isPlaying
                      ? 'bg-slate-200 text-slate-500 cursor-default'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  <Pause className="w-4 h-4" />
                  <span>Jeda</span>
                </button>
              </>
            ) : (
              <span className="text-xs font-semibold text-slate-600 px-1">
                {embedUrl
                  ? 'Kawalan main/jeda tersedia di dalam paparan pemain video.'
                  : 'Muat naik fail video atau tampal pautan untuk mengaktifkan pemain.'}
              </span>
            )}

            <button
              type="button"
              onClick={handleReplay}
              disabled={!activeSourceUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50 text-xs font-bold text-slate-800 transition-colors min-h-[40px] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-sky-600" />
              <span>Ulang Video</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isDirectVideo && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 min-h-[40px]">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="text-slate-700 hover:text-slate-900 cursor-pointer"
                  aria-label={isMuted ? 'Buka suara' : 'Senyapkan suara'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-600" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-sky-600" />
                  )}
                </button>
                <label htmlFor="video-volume-slider" className="text-xs font-semibold text-slate-700">
                  Volum:
                </label>
                <input
                  id="video-volume-slider"
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-20 accent-sky-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700 tabular-nums w-9 text-right">
                  {isMuted ? 0 : volume}%
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleFullscreen}
              disabled={!activeSourceUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50 text-xs font-bold text-slate-800 transition-colors min-h-[40px] cursor-pointer"
            >
              <Maximize className="w-4 h-4" />
              <span>Skrin Penuh</span>
            </button>
          </div>
          </div>
        )}
      </div>

      {/* Teacher Video Input Panel (Upload or URL) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
              Ruang Guru (Pilihan): Guna Video Sendiri
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {uploadedFileName
                ? `Fail dimuat naik: ${uploadedFileName}`
                : teacherVideoUrl
                  ? 'Pautan video guru aktif dan disimpan.'
                  : 'Video beranimasi binaan dalam sudah sedia dimainkan di atas. Guru juga boleh menampal pautan YouTube atau memuat naik fail video sendiri.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowTeacherPanel((prev) => !prev)}
            className="text-xs font-bold text-sky-700 hover:text-sky-800 px-3 py-2 rounded-lg hover:bg-sky-50 cursor-pointer shrink-0"
          >
            {showTeacherPanel ? 'Tutup Panel' : 'Buka Panel'}
          </button>
        </div>

        {showTeacherPanel && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2 border-t border-slate-100">
            <form onSubmit={handleApplyUrl} className="lg:col-span-7 flex flex-col sm:flex-row gap-2.5">
              <div className="flex-1">
                <label htmlFor="teacher-video-url" className="sr-only">
                  Pautan Video
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="teacher-video-url"
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Tampal pautan YouTube atau MP4 di sini..."
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 min-h-[44px]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                Guna Pautan
              </button>
            </form>

            <div className="lg:col-span-5 flex flex-wrap items-center gap-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="teacher-video-upload"
              />
              <label
                htmlFor="teacher-video-upload"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold cursor-pointer min-h-[44px] whitespace-nowrap"
              >
                <Upload className="w-4 h-4" />
                <span>Muat Naik Fail Video</span>
              </label>

              {activeSourceUrl && (
                <button
                  type="button"
                  onClick={handleClearVideo}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold cursor-pointer min-h-[44px] whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Padam</span>
                </button>
              )}
            </div>

            {urlError && (
              <p className="lg:col-span-12 text-xs font-semibold text-red-600">{urlError}</p>
            )}
          </div>
        )}
      </div>

      {/* Interactive 5 Perkataan Sasaran (Target Vocabulary) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              5 Perkataan Sasaran Kebersihan Diri
            </h3>
            <p className="text-sm text-slate-600">
              Klik setiap perkataan untuk membaca suku kata dan mendengar sebutan.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 tabular-nums">
            Perkataan dibaca: {learnedWordIds.length} / {TARGET_WORDS.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {TARGET_WORDS.map((item) => {
            const isSelected = activeWord.id === item.id;
            const isLearned = learnedWordIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleWordSelect(item.id, item.word)}
                className={`px-3 py-3 rounded-xl border text-center transition-all cursor-pointer min-h-[56px] flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-yellow-100 border-yellow-500 text-slate-900 shadow-xs'
                    : isLearned
                      ? 'bg-emerald-50/70 border-emerald-300 text-slate-900 hover:border-emerald-400'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-sky-400 hover:bg-white'
                }`}
              >
                <span className="font-display text-sm sm:text-base font-extrabold tracking-wide">
                  {item.word}
                </span>
                <span className="text-[11px] font-medium text-slate-600">{item.syllables}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Word Detail Panel */}
        <div className="rounded-2xl bg-sky-50/70 border border-sky-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-xl font-extrabold text-slate-900">
                {activeWord.word}
              </span>
              <span className="text-xs font-semibold text-sky-700">({activeWord.syllables})</span>
            </div>
            <p className="text-sm text-slate-800 font-medium">{activeWord.meaning}</p>
            <p className="text-xs text-slate-600">Contoh ayat: {activeWord.usageExample}</p>
          </div>

          <button
            type="button"
            onClick={() => handleWordSelect(activeWord.id, `${activeWord.word}. ${activeWord.usageExample}`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-sky-300 hover:bg-sky-100 text-sky-800 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
          >
            <Volume2 className="w-4 h-4" />
            <span>Dengar Sebutan</span>
          </button>
        </div>
      </section>

      {/* Suggested Video Storyboard Summary */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <CharacterAvatar character="charmander" size="sm" />
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Urutan Cerita Video: Amalan Kebersihan Diri
            </h3>
            <p className="text-xs text-slate-600">
              Charmander membantu mengingatkan langkah kebersihan pagi dalam video.
            </p>
          </div>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {VIDEO_STORYBOARD.map((scene) => (
            <li
              key={scene.step}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-start gap-3"
            >
              <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-xs font-extrabold text-slate-800 flex items-center justify-center shrink-0 tabular-nums">
                {scene.step}
              </span>
              <span className="text-sm font-medium text-slate-800 leading-snug">{scene.text}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Mission B Completion Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {missionCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <Play className="w-6 h-6 text-red-600 shrink-0" />
          )}
          <div>
            <p className="font-display text-base font-bold text-slate-900">
              {missionCompleted
                ? 'Hebat Pelatih! Aktiviti Tonton Video telah selesai!'
                : 'Sudah selesai menonton video dan membaca perkataan sasaran?'}
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              Tandakan selesai untuk membuka Bahagian B: Uji Pemerhatian.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {!missionCompleted && (
            <button
              type="button"
              onClick={handleConfirmWatched}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors whitespace-nowrap cursor-pointer min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Selesai Menonton</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (!missionCompleted) handleConfirmWatched();
              onNextMission();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors whitespace-nowrap cursor-pointer min-h-[44px]"
          >
            <span>Ke Bahagian B: Uji Pemerhatian</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
