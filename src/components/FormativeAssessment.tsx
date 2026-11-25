import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  ClipboardList,
} from 'lucide-react';
import { FORMATIVE_METHODS } from '../data/phase1Data';
import { playClickPop } from '../utils/audio';
import { CharacterDialogue } from './CharacterDialogue';
import { CharacterAvatar } from './PokemonIcons';

interface FormativeAssessmentProps {
  checkedMethodIds: string[];
  onToggleChecked: (methodId: string) => void;
  onGoToMission: () => void;
}

interface TeacherStepGuide {
  id: string;
  stageLabel: string;
  missionLabel: string;
  duration: string;
  objective: string;
  steps: string[];
  assessmentFocus: string;
  badgeClass: string;
}

const TEACHER_LESSON_STEPS: TeacherStepGuide[] = [
  {
    id: 'set-induksi',
    stageLabel: 'Set Induksi',
    missionLabel: 'Misi 1: Kenali dan Perhati',
    duration: '5–8 minit',
    objective:
      'Mencungkil pengetahuan sedia ada murid tentang amalan kebersihan diri melalui penerokaan gambar rangsangan.',
    steps: [
      'Paparkan halaman utama "Misi Kebersihan Pokémon" dan perkenalkan watak pemandu (Pikachu, Squirtle, Bulbasaur, Charmander dan Eevee).',
      'Bimbing murid meneroka empat kad gambar dalam Bahagian A: Teroka Gambar (menggosok gigi, mencuci tangan, mandi, menyikat rambut) dan bersoal jawab secara lisan.',
      'Minta murid meneruskan ke Bahagian B: Uji Pemerhatian untuk menjawab 3 soalan pemerhatian awal secara kelas atau individu.',
    ],
    assessmentFocus:
      'Pemerhatian lisan, angkat kad jawapan A/B/C dan penglibatan awal murid.',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
  },
  {
    id: 'langkah-1',
    stageLabel: 'Langkah 1',
    missionLabel: 'Misi 2: Kenali Perkataan (Penerokaan & Pemahaman)',
    duration: '12–15 minit',
    objective:
      'Membimbing murid mengecam, membaca secara mekanis mengikut suku kata dan memahami maksud 5 perkataan kebersihan diri.',
    steps: [
      'Gunakan Bahagian A (Kad Perkataan) untuk menekan butang audio sebutan satu demi satu (sa-bun, be-rus gi-gi, tu-a-la, syam-pu, si-kat) dan minta murid mengikut secara kelas dan individu.',
      'Mainkan Video Interaktif (Bahagian B) yang berhenti secara automatik di lima hentian soalan. Minta murid mengangkat kad jawapan sebelum guru menekan jawapan di skrin.',
      'Bimbing murid meneroka lima objek bersama rakan Pokémon (Bahagian C) dan gunakan Pikachu AI – Rakan Belajar (Bahagian D) untuk menguji contoh ayat atau mendapatkan petunjuk suku kata.',
    ],
    assessmentFocus:
      'Ketepatan sebutan perkataan mengikut Bahasa Melayu standard dan kebolehan menjawab 5 soalan hentian video.',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  {
    id: 'langkah-2',
    stageLabel: 'Langkah 2',
    missionLabel: 'Misi 3: Cabaran Pokémon (Pengukuhan & E-Pentaksiran)',
    duration: '15 minit',
    objective:
      'Mengukuhkan penguasaan membaca dan memadankan perkataan dengan gambar melalui permainan interaktif serta kuiz 10 soalan.',
    steps: [
      'Jalankan permainan "Pokémon Word Match" (Bahagian A) secara bergilir di papan pintar atau peranti murid untuk memadankan perkataan dengan gambar.',
      'Laksanakan "Tangkap Perkataan Pokémon" (Bahagian B) secara berkumpulan supaya murid pantas mengecam ejaan perkataan berdasarkan gambar.',
      'Tadbir E-Pentaksiran 10 soalan (Bahagian C) dan semak papan skor Pokémon (Bahagian D). Sasaran penguasaan ialah sekurang-kurangnya 6/10 atau 3 daripada 5 perkataan sasaran dikuasai.',
    ],
    assessmentFocus:
      'Skor automatik e-pentaksiran dan senarai perkataan yang sudah dikuasai berbanding perkataan yang perlu dilatih semula.',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    id: 'langkah-3',
    stageLabel: 'Langkah 3',
    missionLabel: 'Misi 4: Aplikasi Kebersihan Diri (Pemulihan & Pengayaan)',
    duration: '12–15 minit',
    objective:
      'Memberi peluang kepada murid mengaplikasikan lima perkataan sasaran dalam situasi harian, pembinaan ayat mudah dan latihan terbeza.',
    steps: [
      'Bimbing murid menyelesaikan 5 situasi dalam Aktiviti A ("Bantu Pokémon Bersihkan Diri!") dengan membaca situasi dan memilih objek yang betul.',
      'Minta murid melengkapkan 5 ayat mudah bergambar dalam Aktiviti B ("Jom Bina Ayat Bersama Pikachu") dan membacanya semula dengan lancar.',
      'Bahagikan murid kepada dua laluan dalam Aktiviti C: murid yang memerlukan bimbingan menjalani Laluan 1 (Latihan Bimbingan dengan audio & petunjuk), manakala murid yang telah menguasai menjalani Laluan 2 (Cabaran Lanjutan).',
    ],
    assessmentFocus:
      'Ketepatan memilih objek mengikut konteks situasi, pelengkapan ayat mudah dan pelaksanaan pemulihan/pengayaan (PBD).',
    badgeClass: 'bg-red-100 text-red-900 border-red-300',
  },
  {
    id: 'penutup',
    stageLabel: 'Penutup',
    missionLabel: 'Misi 5: Tamatkan Pengembaraan (Penilaian Akhir & Refleksi)',
    duration: '8–10 minit',
    objective:
      'Menilai penguasaan akhir murid terhadap objektif pembelajaran, melaksanakan refleksi kendiri dan memberi pengiktirafan.',
    steps: [
      'Minta murid menjawab 5 soalan Cabaran Akhir (Bahagian A) sebagai semakan akhir penguasaan sekurang-kurangnya 3 daripada 5 perkataan.',
      'Bimbing murid mengisi Refleksi Murid (Bahagian B) untuk menyatakan tahap keyakinan diri dan perkataan yang paling mudah dibaca.',
      'Baca bersama-sama Rumusan 5 Perkataan Sasaran (Bahagian C), masukkan nama murid untuk menjana Sijil Pelatih Kebersihan Pokémon (Bahagian D), dan simpulkan nilai murni menjaga kebersihan diri setiap hari.',
    ],
    assessmentFocus:
      'Pencapaian objektif pembelajaran (>= 3/5 perkataan dikuasai), refleksi kendiri murid dan rumusan pengajaran.',
    badgeClass: 'bg-violet-100 text-violet-900 border-violet-300',
  },
];

export const FormativeAssessment: React.FC<FormativeAssessmentProps> = ({
  checkedMethodIds,
  onToggleChecked,
  onGoToMission,
}) => {
  const [guideOpen, setGuideOpen] = useState(true);
  const [selectedStageId, setSelectedStageId] = useState<string>('set-induksi');
  const [activeFlashCard, setActiveFlashCard] = useState<'A' | 'B' | 'C' | null>(null);

  const handleToggleGuide = () => {
    playClickPop();
    setGuideOpen((prev) => !prev);
  };

  const currentStage =
    TEACHER_LESSON_STEPS.find((s) => s.id === selectedStageId) || TEACHER_LESSON_STEPS[0];

  return (
    <div className="space-y-8 pb-14">
      {/* Header Section */}
      <section className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-sky-700 mb-1">
              Pentaksiran Formatif &amp; Panduan Guru · Bahasa Melayu Tahun 2
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              PENTAKSIRAN BILIK DARJAH &amp; PANDUAN GURU
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Kaedah interaksi kelas bersama murid serta panduan langkah pengajaran guru daripada Set Induksi, Langkah 1, Langkah 2, Langkah 3 hingga Penutup.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToMission}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
          >
            <span>Kembali ke Misi 1</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <CharacterDialogue
          character="bulbasaur"
          message="Bagus Pelatih! Mari kongsikan apa yang kamu lihat dan pelajari bersama guru serta rakan sekelas."
        />
      </section>

      {/* 4 Assessment Methods Grid */}
      <section aria-label="Empat kaedah pentaksiran formatif awal" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FORMATIVE_METHODS.map((method) => {
          const isChecked = checkedMethodIds.includes(method.id);
          return (
            <div
              key={method.id}
              className={`rounded-2xl border bg-white/95 backdrop-blur-xs p-5 sm:p-6 flex flex-col justify-between gap-4 transition-colors ${
                isChecked ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <CharacterAvatar character={method.character} size="md" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h2 className="font-display text-lg font-extrabold text-slate-900">
                    {method.title}
                  </h2>
                  <p className="text-sm sm:text-base font-medium text-slate-800">
                    {method.description}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {method.teacherAction}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  {isChecked ? 'Telah dilaksanakan di kelas' : 'Sedia untuk dilaksanakan'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    playClickPop();
                    onToggleChecked(method.id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[40px] whitespace-nowrap ${
                    isChecked
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {isChecked ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Dilaksanakan</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      <span>Tanda Selesai</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Panduan Guru Lengkap: Set Induksi, Langkah 1, Langkah 2, Langkah 3 hingga Penutup */}
      <section className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={handleToggleGuide}
          aria-expanded={guideOpen}
          className="w-full px-5 sm:px-7 py-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-yellow-100 border border-yellow-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
                Panduan Guru Lengkap (Langkah 1, 2, 3 hingga Penutup)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Rancangan pelaksanaan pengajaran berperingkat daripada Set Induksi, Langkah 1, Langkah 2, Langkah 3 hingga Penutup serta kad jawapan kelas.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 shrink-0">
            <span>{guideOpen ? 'Tutup Panduan' : 'Buka Panduan'}</span>
            {guideOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        {guideOpen && (
          <div className="px-5 sm:px-7 pb-7 pt-4 border-t border-slate-100 space-y-6">
            {/* Step Selector Pills/Tabs */}
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Fasa pengajaran guru">
              {TEACHER_LESSON_STEPS.map((stage) => {
                const isSelected = stage.id === selectedStageId;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      playClickPop();
                      setSelectedStageId(stage.id);
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[42px] ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-sky-300'
                    }`}
                  >
                    {stage.stageLabel}
                  </button>
                );
              })}
            </div>

            {/* Active Stage Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg border text-xs font-extrabold ${currentStage.badgeClass}`}
                  >
                    {currentStage.stageLabel} · Cadangan Masa: {currentStage.duration}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
                    {currentStage.missionLabel}
                  </h3>
                </div>
              </div>

              <div className="rounded-xl bg-white border border-slate-200 p-3.5 text-sm text-slate-800">
                <span className="font-bold text-slate-900">Fokus &amp; Objektif:</span>{' '}
                {currentStage.objective}
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Cadangan Aktiviti Guru &amp; Murid
                </p>
                <ol className="space-y-2.5">
                  {currentStage.steps.map((stepText, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-3.5 text-sm text-slate-800"
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-extrabold flex items-center justify-center shrink-0 tabular-nums">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{stepText}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-start gap-2.5 text-sm text-emerald-950">
                <ClipboardList className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Fokus Pentaksiran:</span>{' '}
                  {currentStage.assessmentFocus}
                </div>
              </div>
            </div>

            {/* Full Summary Table of All Stages (Set Induksi -> Penutup) */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <h3 className="font-display text-sm sm:text-base font-extrabold text-slate-900">
                  Ringkasan Aliran Pengajaran Keseluruhan (Set Induksi hingga Penutup)
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {TEACHER_LESSON_STEPS.map((stage) => (
                  <div
                    key={stage.id}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 text-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`px-2.5 py-1 rounded-lg border text-xs font-extrabold shrink-0 ${stage.badgeClass}`}
                      >
                        {stage.stageLabel}
                      </span>
                      <span className="font-bold text-slate-900">{stage.missionLabel}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 md:text-right">
                      {stage.assessmentFocus}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Classroom Response Card Preview for "Angkat Kad Jawapan" */}
            <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-display text-base font-bold text-slate-900">
                    Paparan Kad Jawapan Kelas (Aktiviti Angkat Kad Jawapan)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Guru boleh memilih huruf A, B atau C untuk dipaparkan secara besar kepada murid.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {(['A', 'B', 'C'] as const).map((letter) => (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => {
                        playClickPop();
                        setActiveFlashCard((prev) => (prev === letter ? null : letter));
                      }}
                      className={`w-11 h-11 rounded-xl font-display text-base font-extrabold border transition-colors cursor-pointer ${
                        activeFlashCard === letter
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              {activeFlashCard && (
                <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col items-center justify-center text-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Kad Jawapan Dipilih</span>
                  <div className="w-24 h-24 rounded-3xl bg-yellow-400 border-4 border-slate-900 flex items-center justify-center font-display text-5xl font-extrabold text-slate-900">
                    {activeFlashCard}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveFlashCard(null)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 mt-1 cursor-pointer"
                  >
                    Tutup Paparan Kad
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
