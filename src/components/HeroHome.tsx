import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { CURRICULUM_INFO, HERO_MEDIA, HOME_OBJECTIVES } from '../data/phase1Data';
import { ALL_PHASES_META } from '../data/phases2to5Data';
import { MissionId, MissionStatus, Phase1ProgressState, PhaseNumber } from '../types/learning';
import { playClickPop } from '../utils/audio';
import { CharacterDialogue } from './CharacterDialogue';
import {
  CharacterMiniIcon,
  GreatBallIcon,
  GymBadgeIcon,
  MapPokeballGraphic,
  PokeBallIcon,
  PokedexIcon,
  ResilientImage,
  TownMapIcon,
} from './PokemonIcons';

interface HeroHomeProps {
  progress: Phase1ProgressState;
  phasesStatusMap: Record<PhaseNumber, MissionStatus>;
  onStartAdventure: () => void;
  onJumpToMission: (mission: MissionId) => void;
  onSelectPhase: (phase: PhaseNumber) => void;
  onOpenMap: () => void;
  onOpenAssessment: () => void;
  onResetProgress: () => void;
}

export const HeroHome: React.FC<HeroHomeProps> = ({
  progress,
  phasesStatusMap,
  onStartAdventure,
  onJumpToMission,
  onSelectPhase,
  onOpenMap,
  onOpenAssessment,
  onResetProgress,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const missionDoneMap: Record<MissionId, boolean> = {
    A: progress.missionACompleted,
    B: progress.missionBCompleted,
    C: progress.missionCCompleted,
  };

  const objectiveIcons: Record<MissionId, React.ReactNode> = {
    A: <PokedexIcon className="w-6 h-6" />,
    B: <GreatBallIcon className="w-6 h-6" />,
    C: <GymBadgeIcon className="w-6 h-6" />,
  };

  const phaseCardIcons: Record<PhaseNumber, React.ReactNode> = {
    1: <CharacterMiniIcon character="pikachu" className="w-8 h-8" />,
    2: <CharacterMiniIcon character="squirtle" className="w-8 h-8" />,
    3: <CharacterMiniIcon character="charmander" className="w-8 h-8" />,
    4: <CharacterMiniIcon character="bulbasaur" className="w-8 h-8" />,
    5: <CharacterMiniIcon character="eevee" className="w-8 h-8" />,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header Banner + Welcome Content */}
      <section className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 overflow-hidden shadow-sm">
        {/* Full-Width Adventure Team Header Image */}
        <div className="relative w-full h-[210px] sm:h-[290px] lg:h-[360px] bg-emerald-50 border-b border-slate-200 overflow-hidden">
          <ResilientImage
            src={HERO_MEDIA.heroImage}
            alt={HERO_MEDIA.heroAlt}
            fallbackTitle="Pikachu, Squirtle, Bulbasaur, Charmander dan Eevee di Padang Rumput"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-slate-950/25" />

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-yellow-300">
                <span>Selamat Datang Pelatih!</span>
                <span aria-hidden="true">·</span>
                <span>{CURRICULUM_INFO.subject} {CURRICULUM_INFO.year}</span>
                <span aria-hidden="true">·</span>
                <span>Misi 1 hingga Misi 5</span>
              </div>
              <h1
                className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-sm"
                style={{ textWrap: 'balance' }}
              >
                {CURRICULUM_INFO.lessonTitle}
              </h1>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-white/95 bg-slate-950/55 backdrop-blur-xs border border-white/20 rounded-xl px-3.5 py-2 self-start sm:self-auto">
              Pasukan Pengembaraan: Pikachu · Squirtle · Bulbasaur · Charmander · Eevee
            </p>
          </div>
        </div>

        {/* Welcome Message, Pikachu Dialogue & Action Buttons */}
        <div className="p-5 sm:p-7 lg:p-8 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-5">
              <p className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed">
                Hai Pelatih! Sertai Pikachu dan rakan Pokémon dalam pengembaraan mengenali kebersihan diri!
              </p>
            </div>
            <div className="lg:col-span-7">
              <CharacterDialogue
                character="pikachu"
                message="Hai Pelatih! Hari ini kita ada satu misi istimewa. Mari belajar cara menjaga kebersihan diri!"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onStartAdventure}
              className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-display text-base sm:text-lg font-extrabold tracking-wide shadow-sm transition-all cursor-pointer min-h-[52px] whitespace-nowrap shrink-0"
            >
              <PokeBallIcon className="w-6 h-6" />
              <span>MULA PENGEMBARAAN</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onOpenMap}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sm font-bold text-sky-800 transition-colors cursor-pointer min-h-[44px] whitespace-nowrap shrink-0"
            >
              <TownMapIcon className="w-5 h-5" />
              <span>Peta 5 Misi</span>
            </button>

            <button
              type="button"
              onClick={onOpenAssessment}
              className="inline-flex items-center gap-2 px-3.5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer min-h-[44px] whitespace-nowrap shrink-0"
            >
              <PokedexIcon className="w-4 h-4" />
              <span>Pentaksiran Formatif Awal</span>
            </button>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  setConfirmReset(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-sm font-bold text-red-700 transition-colors cursor-pointer min-h-[44px] whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Semula</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmReset(false);
                    onResetProgress();
                  }}
                  className="px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-extrabold cursor-pointer min-h-[44px] whitespace-nowrap"
                >
                  Sahkan Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3.5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-sm font-bold cursor-pointer min-h-[44px] whitespace-nowrap"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Two Concise Objectives Strip (Phase 1 Induction) */}
      <section aria-labelledby="objektif-ringkas-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 id="objektif-ringkas-heading" className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Dua Bahagian Misi 1: Set Induksi
            </h2>
            <p className="text-sm text-slate-600">
              Lengkapkan aktiviti set induksi ini sebelum meneruskan ke Misi 2 hingga Misi 5.
            </p>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            Tema: {CURRICULUM_INFO.theme}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HOME_OBJECTIVES.map((obj) => {
            const done = missionDoneMap[obj.mission];
            return (
              <button
                key={obj.number}
                type="button"
                onClick={() => onJumpToMission(obj.mission)}
                className={`group text-left rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between gap-4 min-h-[140px] ${
                  done
                    ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-400'
                    : 'bg-white border-slate-200 hover:border-sky-400 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    {objectiveIcons[obj.mission]}
                  </div>
                  {done ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesai</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 tabular-nums">
                      {obj.mission === 'A' ? 'Bahagian A' : 'Bahagian B'}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {obj.number}. {obj.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {obj.detail}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5-Phase Adventure Overview Strip */}
      <section aria-labelledby="peta-lima-fasa-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 id="peta-lima-fasa-heading" className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Laluan Lengkap 5 Misi Pengembaraan
            </h2>
            <p className="text-sm text-slate-600">
              Setiap misi mengandungi 2 bahagian (Bahagian A &amp; Bahagian B). Klik mana-mana misi untuk bermula.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenMap}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-700 hover:underline cursor-pointer self-start sm:self-auto"
          >
            <TownMapIcon className="w-4 h-4" />
            <span>Buka Peta Pengembaraan →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ALL_PHASES_META.map((phase) => {
            const status = phasesStatusMap[phase.phaseNumber];
            const isDone = status === 'Selesai';
            const isInProgress = status === 'Sedang berlangsung';

            return (
              <button
                key={phase.phaseNumber}
                type="button"
                onClick={() => onSelectPhase(phase.phaseNumber)}
                className={`text-left rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isDone
                    ? 'bg-emerald-50/90 border-emerald-300 hover:border-emerald-400'
                    : isInProgress
                      ? 'bg-sky-50/90 border-sky-300 hover:border-sky-400'
                      : 'bg-white/95 border-slate-200 hover:border-sky-400'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-600">
                    {phaseCardIcons[phase.phaseNumber]}
                    <span>Misi {phase.phaseNumber}</span>
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isInProgress ? (
                    <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                  ) : (
                    <MapPokeballGraphic variant="poke" className="w-4 h-4 opacity-40 shrink-0" />
                  )}
                </div>

                <div>
                  <h3 className="font-display text-sm font-extrabold text-slate-900 leading-snug">
                    {phase.missionTitle}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 mt-1">{status}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Curriculum Reference Footer Box */}
      <section className="rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Standard Kandungan</p>
            <p className="font-semibold text-slate-900">{CURRICULUM_INFO.contentStandard}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Standard Pembelajaran</p>
            <p className="font-semibold text-slate-900">{CURRICULUM_INFO.learningStandard}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">Objektif Pembelajaran</p>
            <p className="text-slate-700 leading-relaxed">{CURRICULUM_INFO.learningObjective}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
