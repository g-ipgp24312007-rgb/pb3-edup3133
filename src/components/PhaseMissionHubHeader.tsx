import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { GreatBallIcon, GymBadgeIcon, PokeBallIcon } from './PokemonIcons';

export interface PhasePartConfig<T extends string> {
  id: T;
  code: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface PhaseMissionHubHeaderProps<T extends string> {
  phaseEyebrow: string;
  missionTitle: string;
  progressLabel: string;
  parts: PhasePartConfig<T>[];
  activePart: T;
  onSelectPart: (partId: T) => void;
  allCompletedAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function PhaseMissionHubHeader<T extends string>({
  phaseEyebrow,
  missionTitle,
  progressLabel,
  parts,
  activePart,
  onSelectPart,
  allCompletedAction,
  className = '',
}: PhaseMissionHubHeaderProps<T>) {
  const completedCount = parts.filter((p) => p.completed).length;
  const totalCount = parts.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allDone = completedCount === totalCount;

  return (
    <section
      className={`rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-7 shadow-sm space-y-5 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-slate-500 mb-1">{phaseEyebrow}</p>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            {missionTitle}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-500">{progressLabel}</p>
            <p className="font-display text-lg font-extrabold text-slate-900 tabular-nums">
              {completedCount}/{totalCount} Selesai ({progressPercent}%)
            </p>
          </div>
          {allDone && allCompletedAction && (
            <button
              type="button"
              onClick={allCompletedAction.onClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-xs sm:text-sm font-extrabold transition-colors cursor-pointer min-h-[44px] whitespace-nowrap"
            >
              <GymBadgeIcon className="w-5 h-5" />
              <span>{allCompletedAction.label}</span>
            </button>
          )}
        </div>
      </div>

      {/* Clean Emerald Progress Bar (matches Misi 1) */}
      <div
        className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={progressLabel}
      >
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Mission Component Selector Cards (matches Misi 1) */}
      <div
        className={`grid gap-4 ${
          parts.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : parts.length === 3
              ? 'grid-cols-1 md:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {parts.map((part) => {
          const isActive = activePart === part.id;
          const isDone = part.completed;

          return (
            <div
              key={part.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between gap-4 transition-colors ${
                isActive
                  ? 'bg-sky-50/70 border-sky-400'
                  : isDone
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    {part.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-500">{part.code}</p>
                    <h2 className="font-display text-base font-bold text-slate-900 leading-snug">
                      {part.title}
                    </h2>
                  </div>
                </div>

                {isDone ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selesai</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 shrink-0">
                    <Circle className="w-3.5 h-3.5" />
                    <span>{isActive ? 'Aktif' : 'Belum'}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-600 leading-snug">{part.subtitle}</span>
                <button
                  type="button"
                  onClick={() => onSelectPart(part.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  {isActive ? (
                    <GreatBallIcon className="w-4 h-4 shrink-0" />
                  ) : isDone ? (
                    <GymBadgeIcon className="w-4 h-4 shrink-0" />
                  ) : (
                    <PokeBallIcon className="w-4 h-4 shrink-0" />
                  )}
                  <span>{isActive ? 'Sedang Dibuka' : isDone ? 'Lihat Semula' : 'Mula Aktiviti'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
