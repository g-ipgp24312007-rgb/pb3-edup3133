import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Home, RotateCcw, Sparkles, Star } from 'lucide-react';
import { MissionId, Phase1ProgressState } from '../types/learning';
import { playVictoryFanfare } from '../utils/audio';
import { CharacterDialogue } from './CharacterDialogue';
import { OpenPokeBallCelebration, TrainerBadgeGraphic } from './PokemonIcons';

interface Phase1CompletionProps {
  progress: Phase1ProgressState;
  allMissionsCompleted: boolean;
  onGoToMission: (mission: MissionId) => void;
  onReviewActivities: () => void;
  onBackHome: () => void;
  onFinalizePhase1: () => void;
  onResetProgress: () => void;
  onNextPhase2: () => void;
}

export const Phase1Completion: React.FC<Phase1CompletionProps> = ({
  progress,
  allMissionsCompleted,
  onGoToMission,
  onReviewActivities,
  onBackHome,
  onFinalizePhase1,
  onResetProgress,
  onNextPhase2,
}) => {
  useEffect(() => {
    if (allMissionsCompleted) {
      playVictoryFanfare();
    }
  }, [allMissionsCompleted]);

  if (!allMissionsCompleted) {
    const remaining: { id: MissionId; label: string; done: boolean }[] = [
      { id: 'A', label: 'Bahagian A: Teroka Gambar', done: progress.missionACompleted },
      { id: 'C', label: 'Bahagian B: Uji Pemerhatian', done: progress.missionCCompleted },
    ];

    return (
      <div className="space-y-6 pb-14">
        <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-bold text-sky-700">Penutup Misi 1: Set Induksi · Lencana Pencapaian</p>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Selesaikan Semua Aktiviti untuk Membuka Lencana!
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Lengkapkan kedua-dua bahagian dalam Misi 1 untuk menerima lencana PELATIH HYGIENE – LEVEL 1.
            </p>
          </div>

          <CharacterDialogue
            character="pikachu"
            message="Ayuh Pelatih! Selesaikan Bahagian A dan Bahagian B dahulu sebelum membuka Poké Ball kejayaan!"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {remaining.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 ${
                  item.done ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-base font-bold text-slate-900">{item.label}</span>
                  {item.done && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                </div>
                <button
                  type="button"
                  onClick={() => onGoToMission(item.id)}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer min-h-[44px] ${
                    item.done
                      ? 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-sky-600 text-white hover:bg-sky-700'
                  }`}
                >
                  <span>{item.done ? 'Lihat Semula' : 'Buka Aktiviti'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-14">
      <section className="relative rounded-3xl bg-white border border-yellow-300 p-6 sm:p-10 shadow-sm overflow-hidden">
        {/* Decorative Success Stars */}
        <div className="pointer-events-none select-none hidden sm:block" aria-hidden="true">
          <Star className="w-7 h-7 text-yellow-400 fill-yellow-400 absolute top-8 left-10 animate-star-twinkle" />
          <Star className="w-5 h-5 text-sky-400 fill-sky-400 absolute top-14 right-14 animate-star-twinkle" />
          <Sparkles className="w-6 h-6 text-amber-500 absolute bottom-10 left-16 animate-star-twinkle" />
          <Star className="w-6 h-6 text-emerald-500 fill-emerald-400 absolute bottom-12 right-12 animate-star-twinkle" />
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          {/* Animated Open Poké Ball & Level 1 Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="animate-gentle-float"
            >
              <OpenPokeBallCelebration className="w-32 h-32 sm:w-36 sm:h-36" />
            </motion.div>

            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <TrainerBadgeGraphic className="w-40 h-40 sm:w-44 sm:h-44" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-bold text-amber-700">
              Lencana Pencapaian Diperoleh
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              TAHNIAH, PELATIH!
            </h1>
            <p className="font-display text-lg sm:text-xl font-extrabold text-sky-700 tracking-wide">
              PELATIH HYGIENE – LEVEL 1
            </p>
          </div>

          <div className="text-left">
            <CharacterDialogue
              character="pikachu"
              message="Pika Pika! Kamu berjaya menyelesaikan Misi 1. Teruskan pengembaraan kamu!"
            />
          </div>

          {/* Summary of Completed Phase 1 Milestones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-800">Bahagian A Selesai</p>
                <p className="text-sm font-semibold text-slate-900">4 Gambar Diteroka</p>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-800">Bahagian B Selesai</p>
                <p className="text-sm font-semibold text-slate-900">3/3 Soalan Betul</p>
              </div>
            </div>
          </div>

          {/* Phase 1 Finalization Status */}
          {progress.phase1Finalized && (
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
              Misi 1: Set Induksi telah disahkan selesai! Rekod pencapaian anda disimpan pada peranti ini.
            </div>
          )}

          {/* Required Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onReviewActivities}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold transition-colors cursor-pointer min-h-[48px] whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Lihat Semula Aktiviti</span>
            </button>

            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-900 text-sm font-bold transition-colors cursor-pointer min-h-[48px] whitespace-nowrap"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Halaman Utama</span>
            </button>

            <button
              type="button"
              onClick={onFinalizePhase1}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold transition-colors cursor-pointer min-h-[48px] whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{progress.phase1Finalized ? 'Misi 1 Selesai' : 'Selesai Misi 1'}</span>
            </button>

            <button
              type="button"
              onClick={onNextPhase2}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-extrabold transition-colors cursor-pointer min-h-[48px] whitespace-nowrap"
            >
              <span>Seterusnya: Misi 2 (Langkah 1)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {progress.phase1Finalized && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onResetProgress}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Mula Semula Sesi Pembelajaran
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
