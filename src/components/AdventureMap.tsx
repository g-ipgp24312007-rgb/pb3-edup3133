import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { ALL_PHASES_META, HYGIENE_WORD_MAP } from '../data/phases2to5Data';
import {
  HygieneWordKey,
  MissionStatus,
  PhaseNumber,
  PokemonCharacterId,
} from '../types/learning';
import { playClickPop, playVictoryFanfare, speakMalay } from '../utils/audio';
import { CharacterDialogue } from './CharacterDialogue';
import {
  CharacterAvatar,
  CharacterMiniIcon,
  GymBadgeIcon,
  MapPokeballGraphic,
  MapPokeballVariant,
  PokeBallIcon,
  ResilientImage,
  TownMapIcon,
  TrainerCapIcon,
} from './PokemonIcons';

const MAP_REGION_IMAGE = '/src/assets/images/map_pokemon_region_1795576645003.jpg';

interface MapStationConfig {
  phaseNumber: PhaseNumber;
  regionName: string;
  storyBlurb: string;
  guide: PokemonCharacterId;
  xPct: number;
  yPct: number;
  ballVariant: MapPokeballVariant;
}

const MAP_STATIONS: MapStationConfig[] = [
  {
    phaseNumber: 1,
    regionName: 'Kampung Padang Hijau',
    storyBlurb: 'Perhatikan empat gambar amalan kebersihan harian dan jawab soalan pemerhatian bersama Pikachu.',
    guide: 'pikachu',
    xPct: 18,
    yPct: 73,
    ballVariant: 'poke',
  },
  {
    phaseNumber: 2,
    regionName: 'Tasik Buih Biru',
    storyBlurb: 'Teroka lima perkataan kebersihan diri, video interaktif dan sembang dengan Pikachu AI.',
    guide: 'squirtle',
    xPct: 21,
    yPct: 28,
    ballVariant: 'great',
  },
  {
    phaseNumber: 3,
    regionName: 'Arena Cabaran Pokémon',
    storyBlurb: 'Uji kepantasan padanan perkataan, permainan tangkap perkataan dan e-pentaksiran.',
    guide: 'charmander',
    xPct: 52,
    yPct: 44,
    ballVariant: 'ultra',
  },
  {
    phaseNumber: 4,
    regionName: 'Bandar Bersih & Kemas',
    storyBlurb: 'Selesaikan situasi rakan Pokémon, bina ayat lengkap dan pilih laluan latihan.',
    guide: 'bulbasaur',
    xPct: 78,
    yPct: 75,
    ballVariant: 'heal',
  },
  {
    phaseNumber: 5,
    regionName: 'Menara Juara Kebersihan',
    storyBlurb: 'Sertai Eevee tamatkan cabaran akhir, tulis refleksi diri dan tuntut Sijil Pelatih Kebersihan!',
    guide: 'eevee',
    xPct: 84,
    yPct: 22,
    ballVariant: 'master',
  },
];

interface HiddenMapPokeball {
  id: string;
  name: string;
  variant: MapPokeballVariant;
  locationLabel: string;
  hint: string;
  wordKey: HygieneWordKey;
  xPct: number;
  yPct: number;
}

const HIDDEN_MAP_POKEBALLS: HiddenMapPokeball[] = [
  {
    id: 'ball-1',
    name: 'Poké Ball Merah',
    variant: 'poke',
    locationLabel: 'Tepi Kebun Kampung Padang Hijau',
    hint: 'Cari di sebelah kiri kampung permulaan!',
    wordKey: 'sabun',
    xPct: 8,
    yPct: 84,
  },
  {
    id: 'ball-2',
    name: 'Great Ball Biru',
    variant: 'great',
    locationLabel: 'Hujung Jeti Tasik Buih Biru',
    hint: 'Cari berhampiran jeti kayu di tasik biru!',
    wordKey: 'berus-gigi',
    xPct: 10,
    yPct: 39,
  },
  {
    id: 'ball-3',
    name: 'Heal Ball Merah Jambu',
    variant: 'heal',
    locationLabel: 'Laluan Rimba Tengah',
    hint: 'Cari di celah pokok antara kampung dan arena!',
    wordKey: 'tuala',
    xPct: 37,
    yPct: 62,
  },
  {
    id: 'ball-4',
    name: 'Ultra Ball Emas',
    variant: 'ultra',
    locationLabel: 'Tepi Jambatan Bandar Bersih',
    hint: 'Cari berhampiran jambatan sungai di bawah!',
    wordKey: 'syampu',
    xPct: 63,
    yPct: 84,
  },
  {
    id: 'ball-5',
    name: 'Master Ball Ungu',
    variant: 'master',
    locationLabel: 'Kaki Bukit Menara Juara',
    hint: 'Cari di laluan mendaki bukit ke Menara Juara!',
    wordKey: 'sikat',
    xPct: 68,
    yPct: 34,
  },
];

const ROUTE_SEGMENTS: { from: PhaseNumber; to: PhaseNumber; d: string }[] = [
  { from: 1, to: 2, d: 'M 180 410 Q 130 280 210 157' },
  { from: 2, to: 3, d: 'M 210 157 Q 365 180 520 247' },
  { from: 3, to: 4, d: 'M 520 247 Q 630 370 780 421' },
  { from: 4, to: 5, d: 'M 780 421 Q 875 270 840 124' },
];

interface AdventureMapProps {
  phasesStatusMap: Record<PhaseNumber, MissionStatus>;
  completedPhasesCount: number;
  foundMapPokeballs: string[];
  onCollectMapPokeball: (ballId: string) => void;
  onSelectPhase: (phase: PhaseNumber) => void;
  onBackHome: () => void;
  onResetProgress: () => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  phasesStatusMap,
  completedPhasesCount,
  foundMapPokeballs,
  onCollectMapPokeball,
  onSelectPhase,
  onBackHome,
  onResetProgress,
}) => {
  const defaultActivePhase: PhaseNumber = useMemo(() => {
    const firstIncomplete = ([1, 2, 3, 4, 5] as PhaseNumber[]).find(
      (p) => phasesStatusMap[p] !== 'Selesai'
    );
    return firstIncomplete || 5;
  }, [phasesStatusMap]);

  const [selectedPhase, setSelectedPhase] = useState<PhaseNumber>(defaultActivePhase);
  const [discoveredBall, setDiscoveredBall] = useState<HiddenMapPokeball | null>(null);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const totalGoalCount = 10; // 5 Misi + 5 Poké Ball
  const totalAchieved = completedPhasesCount + foundMapPokeballs.length;
  const progressPercent = Math.round((totalAchieved / totalGoalCount) * 100);
  const allMastered = completedPhasesCount === 5 && foundMapPokeballs.length === 5;

  const selectedStation =
    MAP_STATIONS.find((s) => s.phaseNumber === selectedPhase) || MAP_STATIONS[0];
  const selectedMeta =
    ALL_PHASES_META.find((m) => m.phaseNumber === selectedPhase) || ALL_PHASES_META[0];
  const selectedStatus = phasesStatusMap[selectedPhase];

  const handleClickStation = (phase: PhaseNumber) => {
    playClickPop();
    setSelectedPhase(phase);
    setDiscoveredBall(null);
    onSelectPhase(phase);
  };

  const handleClickHiddenBall = (ball: HiddenMapPokeball) => {
    const isNew = !foundMapPokeballs.includes(ball.id);
    if (isNew) {
      onCollectMapPokeball(ball.id);
      playVictoryFanfare();
      const targetWord = HYGIENE_WORD_MAP[ball.wordKey].word;
      speakMalay(`Tahniah Pelatih! Kamu menjumpai ${ball.name} dan kad perkataan ${targetWord}!`);
    } else {
      playClickPop();
    }
    setDiscoveredBall(ball);
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Header Summary + Poké Ball Belt */}
      <section className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-sky-700">
              Peta Cerita Pengembaraan · Misi 1 hingga Misi 5
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <TownMapIcon className="w-8 h-8 shrink-0" />
              <span>Peta Wilayah Kebersihan Pokémon</span>
            </h1>
            <p className="text-sm text-slate-600">
              Lengkapkan kelima-lima stesen misi dan cari 5 Poké Ball tersembunyi di seluruh peta!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-right">
              <p className="text-[11px] font-bold text-slate-500">Kemajuan Peta</p>
              <p className="font-display text-lg font-extrabold text-slate-900 tabular-nums">
                {completedPhasesCount}/5 Misi · {foundMapPokeballs.length}/5 Poké Ball
              </p>
            </div>
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold cursor-pointer min-h-[44px] whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <PokeBallIcon className="w-4 h-4" />
              <span>Utama</span>
            </button>
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  setConfirmReset(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs sm:text-sm font-bold cursor-pointer min-h-[44px] whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Semula</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmReset(false);
                    onResetProgress();
                  }}
                  className="px-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold cursor-pointer min-h-[44px] whitespace-nowrap"
                >
                  Sahkan Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold cursor-pointer min-h-[44px]"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Combined Map Progress Bar */}
        <div
          className="w-full h-3 rounded-full bg-slate-100 overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Kemajuan misi dan pencarian Poké Ball"
        >
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Trainer Poké Ball Belt (5 Collectible Slots) */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <TrainerCapIcon className="w-6 h-6 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                Beg Pelatih: Koleksi Poké Ball Rahsia ({foundMapPokeballs.length}/5)
              </p>
              <p className="text-xs text-slate-700">
                {foundMapPokeballs.length === 5
                  ? 'Hebat! Semua 5 Poké Ball tersembunyi telah ditemui!'
                  : 'Cari Poké Ball yang berkelip di atas peta dan klik untuk mengutipnya.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {HIDDEN_MAP_POKEBALLS.map((ball) => {
              const collected = foundMapPokeballs.includes(ball.id);
              return (
                <button
                  key={ball.id}
                  type="button"
                  onClick={() => handleClickHiddenBall(ball)}
                  title={collected ? `${ball.name} (Dijumpai!)` : `Petunjuk: ${ball.hint}`}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
                    collected
                      ? 'bg-white border-emerald-300 text-emerald-900 shadow-xs hover:border-emerald-400'
                      : 'bg-white/60 border-dashed border-amber-400 text-amber-900 hover:bg-white'
                  }`}
                >
                  <span className={collected ? '' : 'opacity-35 grayscale'}>
                    <MapPokeballGraphic variant={ball.variant} className="w-5 h-5" />
                  </span>
                  <span className="hidden md:inline">
                    {collected ? HYGIENE_WORD_MAP[ball.wordKey].word : '???'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <CharacterDialogue
          character="pikachu"
          message={
            allMastered
              ? 'Pika Pika! Luar biasa Pelatih! Kamu telah melengkapkan kelima-lima misi dan menjumpai semua 5 Poké Ball di peta!'
              : 'Klik terus mana-mana stesen misi di atas peta untuk memulakan pembelajaran, dan cari 5 Poké Ball rahsia yang berkelip!'
          }
        />
      </section>

      {/* Interactive Story Map Canvas */}
      <section
        aria-label="Peta Cerita Wilayah Kebersihan Pokémon"
        className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-3 sm:p-5 shadow-sm space-y-4"
      >
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border-2 border-sky-200 bg-emerald-100 shadow-inner">
          <ResilientImage
            src={MAP_REGION_IMAGE}
            alt="Peta dunia pengembaraan Pokémon dengan 5 stesen kebersihan diri"
            fallbackTitle="Peta Wilayah Kebersihan Pokémon"
            className="w-full h-full object-cover select-none"
          />

          {/* Winding SVG Adventure Path Connecting Stations 1 to 5 */}
          <svg
            viewBox="0 0 1000 562"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            {ROUTE_SEGMENTS.map((seg) => {
              const unlocked = phasesStatusMap[seg.from] === 'Selesai';
              return (
                <g key={`${seg.from}-${seg.to}`}>
                  <path
                    d={seg.d}
                    fill="none"
                    stroke="rgba(15, 23, 42, 0.35)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray="14 12"
                  />
                  <path
                    d={seg.d}
                    fill="none"
                    stroke={unlocked ? '#10B981' : '#FEF08A'}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="14 12"
                  />
                </g>
              );
            })}
          </svg>

          {/* 5 Hidden Collectible Poké Balls */}
          {HIDDEN_MAP_POKEBALLS.map((ball) => {
            const collected = foundMapPokeballs.includes(ball.id);
            return (
              <button
                key={ball.id}
                type="button"
                onClick={() => handleClickHiddenBall(ball)}
                style={{ left: `${ball.xPct}%`, top: `${ball.yPct}%` }}
                aria-label={
                  collected
                    ? `${ball.name} telah dijumpai di ${ball.locationLabel}`
                    : `Cari Poké Ball tersembunyi: ${ball.hint}`
                }
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group flex items-center justify-center rounded-full transition-transform cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${
                  collected
                    ? 'w-9 h-9 sm:w-11 sm:h-11 bg-emerald-500/90 border-2 border-white shadow-md hover:scale-110'
                    : 'w-10 h-10 sm:w-12 sm:h-12 bg-yellow-300/90 border-2 border-slate-900 shadow-lg hover:scale-115 animate-pokeball-wiggle'
                }`}
              >
                <MapPokeballGraphic
                  variant={ball.variant}
                  className="w-6 h-6 sm:w-7 sm:h-7"
                />
                {!collected && (
                  <Sparkles
                    className="w-3.5 h-3.5 text-yellow-700 absolute -top-1.5 -right-1.5 animate-star-twinkle"
                    aria-hidden="true"
                  />
                )}
                {collected && (
                  <CheckCircle2
                    className="w-4 h-4 text-white bg-emerald-600 rounded-full absolute -bottom-1 -right-1"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}

          {/* 5 Mission Station Markers */}
          {MAP_STATIONS.map((station) => {
            const status = phasesStatusMap[station.phaseNumber];
            const isDone = status === 'Selesai';
            const isCurrentActive = defaultActivePhase === station.phaseNumber;
            const isSelected = selectedPhase === station.phaseNumber;

            return (
              <div
                key={station.phaseNumber}
                style={{ left: `${station.xPct}%`, top: `${station.yPct}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
              >
                {/* Trainer Marker on active mission */}
                {isCurrentActive && (
                  <div className="mb-1 px-2 py-0.5 rounded-lg bg-red-600 border border-white text-white text-[10px] sm:text-xs font-extrabold shadow-md flex items-center gap-1 animate-gentle-float whitespace-nowrap">
                    <TrainerCapIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Pelatih di sini!</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleClickStation(station.phaseNumber)}
                  aria-label={`Buka Misi ${station.phaseNumber}: ${station.regionName}`}
                  className="group flex flex-col items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                >
                  <span
                    className={`relative flex items-center gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border-2 font-display font-extrabold text-xs sm:text-sm shadow-lg transition-transform group-hover:scale-105 min-h-[42px] ${
                      isSelected
                        ? 'bg-slate-900 text-white border-yellow-400 scale-105'
                        : isDone
                          ? 'bg-emerald-600 text-white border-white'
                          : 'bg-white text-slate-900 border-slate-900 group-hover:bg-sky-50'
                    }`}
                  >
                    <span className="relative inline-flex items-center justify-center shrink-0">
                      <CharacterMiniIcon
                        character={station.guide}
                        className="w-7 h-7 sm:w-8 sm:h-8 border-white"
                      />
                      {isDone && (
                        <CheckCircle2
                          className="w-4 h-4 text-white bg-emerald-600 rounded-full absolute -bottom-1 -right-1 border border-white"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span className="whitespace-nowrap">
                      Misi {station.phaseNumber}
                    </span>
                  </span>

                  <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/85 group-hover:bg-red-600 text-white text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-xs transition-colors">
                    {station.regionName}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Discovered Poké Ball Story Card (RPG Item Found Box) */}
        {discoveredBall && (
          <div className="rounded-2xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 via-white to-sky-50 p-4 sm:p-5 shadow-md space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-yellow-400 flex items-center justify-center shrink-0 shadow-xs">
                  <MapPokeballGraphic variant={discoveredBall.variant} className="w-9 h-9" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-amber-700">
                    Item Dijumpai · {discoveredBall.locationLabel}
                  </p>
                  <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
                    Tahniah! Kamu menjumpai {discoveredBall.name}!
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDiscoveredBall(null)}
                aria-label="Tutup paparan Poké Ball"
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {(() => {
              const wordObj = HYGIENE_WORD_MAP[discoveredBall.wordKey];
              return (
                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <ResilientImage
                        src={wordObj.imageUrl}
                        alt={wordObj.imageAlt}
                        fallbackTitle={wordObj.word}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-sky-700">
                        Kad Perkataan Rahsia ({wordObj.syllables})
                      </p>
                      <p className="font-display text-xl font-extrabold text-slate-900">
                        {wordObj.word}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600">
                        {wordObj.usageDescription}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      speakMalay(`${wordObj.word}. ${wordObj.usageDescription}`)
                    }
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold cursor-pointer min-h-[44px] whitespace-nowrap shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Dengar Sebutan</span>
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {/* Selected Station Story Briefing Bar */}
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <CharacterAvatar character={selectedStation.guide} size="md" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="text-sky-800">{selectedStation.regionName}</span>
                <span aria-hidden="true">·</span>
                <span
                  className={
                    selectedStatus === 'Selesai'
                      ? 'text-emerald-700'
                      : selectedStatus === 'Sedang berlangsung'
                        ? 'text-sky-700'
                        : 'text-slate-600'
                  }
                >
                  Status: {selectedStatus}
                </span>
              </div>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
                {selectedMeta.missionTitle}
              </h2>
              <p className="text-sm text-slate-700">{selectedStation.storyBlurb}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectPhase(selectedPhase)}
            className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-extrabold transition-colors cursor-pointer min-h-[48px] whitespace-nowrap shrink-0 ${
              selectedStatus === 'Selesai'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
            }`}
          >
            <CharacterMiniIcon character={selectedStation.guide} className="w-6 h-6 border-white" />
            <span>
              {selectedStatus === 'Selesai'
                ? `Lihat Semula Misi ${selectedPhase}`
                : selectedStatus === 'Sedang berlangsung'
                  ? `Teruskan Misi ${selectedPhase}`
                  : `Masuk ke Misi ${selectedPhase}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Master Trainer Celebration Banner when all 5 Missions + 5 Poké Balls complete */}
      {allMastered && (
        <section className="rounded-3xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 via-amber-50 to-emerald-50 p-5 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <GymBadgeIcon className="w-12 h-12 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-amber-700">
                Pencapaian Terunggul Peta Pokémon
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
                Juara Peta Kebersihan Pokémon!
              </h2>
              <p className="text-sm text-slate-700">
                Semua 5 misi telah selesai dan kesemua 5 Poké Ball rahsia telah berjaya dikumpulkan!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectPhase(5)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold cursor-pointer min-h-[46px] whitespace-nowrap shrink-0"
          >
            <GymBadgeIcon className="w-4 h-4" />
            <span>Lihat Sijil Juara</span>
          </button>
        </section>
      )}

      {/* 5 Mission Route Cards for Quick Access */}
      <section aria-label="Senarai lima stesen misi pembelajaran" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_PHASES_META.map((phase) => {
          const station = MAP_STATIONS.find((s) => s.phaseNumber === phase.phaseNumber)!;
          const ball = HIDDEN_MAP_POKEBALLS[phase.phaseNumber - 1];
          const ballCollected = foundMapPokeballs.includes(ball.id);
          const status = phasesStatusMap[phase.phaseNumber];
          const isDone = status === 'Selesai';
          const isInProgress = status === 'Sedang berlangsung';

          return (
            <div
              key={phase.phaseNumber}
              className={`rounded-3xl border p-5 flex flex-col justify-between gap-4 transition-colors bg-white/95 backdrop-blur-xs ${
                isDone
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : isInProgress
                    ? 'border-sky-300 bg-sky-50/30'
                    : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CharacterAvatar character={station.guide} size="sm" />
                    <div>
                      <p className="text-xs font-bold text-sky-700">{station.regionName}</p>
                      <p className="text-[11px] font-semibold text-slate-500">
                        {ballCollected ? `${ball.name} Dijumpai` : `Cari: ${ball.hint}`}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold shrink-0 ${
                      isDone
                        ? 'text-emerald-700'
                        : isInProgress
                          ? 'text-sky-700'
                          : 'text-slate-500'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isInProgress ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}
                    <span>{status}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-extrabold text-slate-900">
                    {phase.missionTitle}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {phase.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPhase(phase.phaseNumber)}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer min-h-[46px] ${
                  isDone
                    ? 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                    : isInProgress
                      ? 'bg-sky-600 hover:bg-sky-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <CharacterMiniIcon character={station.guide} className="w-5 h-5 border-white" />
                <span>
                  {isDone ? 'Lihat Semula' : isInProgress ? 'Teruskan Misi' : 'Mula Misi'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
};

interface PhaseStepperBarProps {
  currentPhase: PhaseNumber;
  phasesStatusMap: Record<PhaseNumber, MissionStatus>;
  onSelectPhase: (phase: PhaseNumber) => void;
}

const STEPPER_BALL_ICONS: Record<PhaseNumber, React.ReactNode> = {
  1: <CharacterMiniIcon character="pikachu" className="w-5 h-5 shrink-0" />,
  2: <CharacterMiniIcon character="squirtle" className="w-5 h-5 shrink-0" />,
  3: <CharacterMiniIcon character="charmander" className="w-5 h-5 shrink-0" />,
  4: <CharacterMiniIcon character="bulbasaur" className="w-5 h-5 shrink-0" />,
  5: <CharacterMiniIcon character="eevee" className="w-5 h-5 shrink-0" />,
};

export const PhaseStepperBar: React.FC<PhaseStepperBarProps> = ({
  currentPhase,
  phasesStatusMap,
  onSelectPhase,
}) => {
  return (
    <nav
      aria-label="Navigasi Misi 1 hingga Misi 5"
      className="rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200 p-2 sm:p-2.5 flex items-center gap-1.5 overflow-x-auto no-print shadow-xs"
    >
      {ALL_PHASES_META.map((phase) => {
        const isCurrent = currentPhase === phase.phaseNumber;
        const status = phasesStatusMap[phase.phaseNumber];
        const isDone = status === 'Selesai';

        return (
          <button
            key={phase.phaseNumber}
            type="button"
            onClick={() => onSelectPhase(phase.phaseNumber)}
            className={`flex-1 min-w-[148px] px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] ${
              isCurrent
                ? 'bg-slate-900 text-white'
                : isDone
                  ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isDone && !isCurrent ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              STEPPER_BALL_ICONS[phase.phaseNumber]
            )}
            <span>{phase.missionTitle}</span>
          </button>
        );
      })}
    </nav>
  );
};
