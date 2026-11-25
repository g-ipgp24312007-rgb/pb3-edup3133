import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  FileBadge2,
  Home,
  Lock,
  MessageSquareHeart,
  Printer,
  RotateCcw,
  Send,
  Trophy,
  Volume2,
  XCircle,
} from 'lucide-react';
import { HERO_MEDIA } from '../../data/phase1Data';
import {
  HYGIENE_OBJECTS,
  HYGIENE_WORD_MAP,
  PHASE5_FINAL_QUESTIONS,
  PHASE5_REFLECTION_FEELINGS,
} from '../../data/phases2to5Data';
import {
  HygieneWordKey,
  MissionStatus,
  Phase5ProgressState,
  PhaseNumber,
} from '../../types/learning';
import {
  playClickPop,
  playSuccessChime,
  playTryAgainTone,
  playVictoryFanfare,
  speakMalay,
} from '../../utils/audio';
import { CharacterDialogue } from '../CharacterDialogue';
import { PhaseMissionHubHeader, PhasePartConfig } from '../PhaseMissionHubHeader';
import {
  CharacterAvatar,
  HealBallIcon,
  PokeBallIcon,
  ResilientImage,
  TrainerBadgeGraphic,
} from '../PokemonIcons';

interface Phase5HubProps {
  progress: Phase5ProgressState;
  phasesStatusMap: Record<PhaseNumber, MissionStatus>;
  onSelectPhase: (phase: PhaseNumber) => void;
  onSelectFinalAnswer: (qId: string, optionKey: 'A' | 'B' | 'C') => void;
  onSubmitFinalChallenge: (
    score: number,
    masteredWords: HygieneWordKey[],
    reviewWords: HygieneWordKey[]
  ) => void;
  onRetryFinalChallenge: () => void;
  onSaveReflection: (feeling: string, easiestWord: HygieneWordKey | '') => void;
  onMarkSummaryReviewed: () => void;
  onGenerateCertificate: (studentName: string) => void;
  onBackPhase4: () => void;
  onBackHome: () => void;
}

type Phase5Tab = 'A' | 'B' | 'C';

export const Phase5Hub: React.FC<Phase5HubProps> = ({
  progress,
  phasesStatusMap,
  onSelectPhase,
  onSelectFinalAnswer,
  onSubmitFinalChallenge,
  onRetryFinalChallenge,
  onSaveReflection,
  onMarkSummaryReviewed,
  onGenerateCertificate,
  onBackPhase4,
  onBackHome,
}) => {
  const [activeTab, setActiveTab] = useState<Phase5Tab>('A');
  const [showCertificateView, setShowCertificatePanel] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(progress.studentName);
  const [nameError, setNameError] = useState<string>('');
  const certGateRef = useRef<HTMLElement | null>(null);

  const handleSelectPart = (part: Phase5Tab) => {
    playClickPop();
    setShowCertificatePanel(false);
    setActiveTab(part);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answeredFinalCount = PHASE5_FINAL_QUESTIONS.filter(
    (q) => Boolean(progress.finalAnswers[q.id])
  ).length;
  const allFinalAnswered = answeredFinalCount === PHASE5_FINAL_QUESTIONS.length;

  const handleSubmitFinal = () => {
    if (!allFinalAnswered) return;
    let score = 0;
    const mastered: HygieneWordKey[] = [];
    const review: HygieneWordKey[] = [];

    PHASE5_FINAL_QUESTIONS.forEach((q) => {
      if (progress.finalAnswers[q.id] === q.correctAnswer) {
        score += 1;
        mastered.push(q.targetWord);
      } else {
        review.push(q.targetWord);
      }
    });

    onSubmitFinalChallenge(score, mastered, review);
    if (score >= 3) {
      playVictoryFanfare();
    } else {
      playTryAgainTone();
    }
  };

  const handleReviewAllWords = () => {
    onMarkSummaryReviewed();
    speakMalay(
      'Lima perkataan kebersihan diri ialah sabun, berus gigi, tuala, syampu dan sikat.'
    );
  };

  const handleGenerateCert = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError('Sila masukkan nama murid sebelum menjana sijil.');
      return;
    }
    setNameError('');
    onGenerateCertificate(trimmed);
    playVictoryFanfare();
  };

  const formattedCompletionDate = progress.completedAt
    ? new Date(progress.completedAt).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  const reflectionMessage = (() => {
    if (!progress.reflectionFeeling && !progress.reflectionEasiestWord) return '';
    const wordText = progress.reflectionEasiestWord
      ? ` Perkataan "${HYGIENE_WORD_MAP[progress.reflectionEasiestWord].word}" memang mudah dan berguna untuk diamalkan setiap hari!`
      : '';
    if (
      progress.reflectionFeeling.includes('bantuan') ||
      progress.reflectionFeeling.includes('berlatih')
    ) {
      return `Tidak mengapa Pelatih! Teruskan berlatih bersama Pikachu supaya kamu semakin mahir.${wordText}`;
    }
    return `Pika Pika! Syabas Pelatih kerana berjaya membaca dan memahami perkataan hari ini!${wordText}`;
  })();

  const phase5PartsDone =
    progress.finalSubmitted &&
    Boolean(progress.reflectionFeeling && progress.reflectionEasiestWord) &&
    progress.summaryReviewed;

  const missionChecklist: {
    id: string;
    label: string;
    done: boolean;
    onOpen: () => void;
  }[] = [
    {
      id: 'm1',
      label: 'Misi 1: Kenali dan Perhati',
      done: phasesStatusMap[1] === 'Selesai',
      onOpen: () => onSelectPhase(1),
    },
    {
      id: 'm2',
      label: 'Misi 2: Kenali Perkataan',
      done: phasesStatusMap[2] === 'Selesai',
      onOpen: () => onSelectPhase(2),
    },
    {
      id: 'm3',
      label: 'Misi 3: Cabaran Pokémon',
      done: phasesStatusMap[3] === 'Selesai',
      onOpen: () => onSelectPhase(3),
    },
    {
      id: 'm4',
      label: 'Misi 4: Aplikasi Kebersihan Diri',
      done: phasesStatusMap[4] === 'Selesai',
      onOpen: () => onSelectPhase(4),
    },
    {
      id: 'm5',
      label: 'Misi 5 (Bahagian A, B & C)',
      done: phase5PartsDone,
      onOpen: () => {
        setShowCertificatePanel(false);
        if (!progress.finalSubmitted) {
          setActiveTab('A');
        } else if (!progress.reflectionFeeling || !progress.reflectionEasiestWord) {
          setActiveTab('B');
        } else {
          setActiveTab('C');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
  ];

  const allMissionsCompleted = missionChecklist.every((item) => item.done);
  const isCertificateOpen = allMissionsCompleted && showCertificateView;

  const handleOpenCertificate = () => {
    if (!allMissionsCompleted) {
      playTryAgainTone();
      certGateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    playVictoryFanfare();
    setShowCertificatePanel(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const partsConfig: PhasePartConfig<Phase5Tab>[] = [
    {
      id: 'A',
      code: 'Bahagian A',
      title: 'Cabaran Akhir',
      subtitle: '5 soalan penilaian akhir',
      icon: <Trophy className="w-5 h-5 text-amber-600" />,
      completed: progress.finalSubmitted,
    },
    {
      id: 'B',
      code: 'Bahagian B',
      title: 'Refleksi Murid',
      subtitle: 'Perasaan & pilihan kata',
      icon: <MessageSquareHeart className="w-5 h-5 text-red-600" />,
      completed: Boolean(progress.reflectionFeeling && progress.reflectionEasiestWord),
    },
    {
      id: 'C',
      code: 'Bahagian C',
      title: 'Rumusan',
      subtitle: 'Imbas 5 perkataan sasaran',
      icon: <BookOpen className="w-5 h-5 text-sky-600" />,
      completed: progress.summaryReviewed,
    },
  ];

  return (
    <div className="space-y-8 pb-14">
      {/* Phase 5 Mission Header & Progress Tracker (Bahagian A, B & C sahaja) */}
      <PhaseMissionHubHeader
        phaseEyebrow="Fasa 5 · Penilaian Akhir, Refleksi & Rumusan"
        missionTitle="MISI 5: TAMATKAN PENGEMBARAAN"
        progressLabel="Kemajuan Aktiviti Misi 5"
        parts={partsConfig}
        activePart={activeTab}
        onSelectPart={handleSelectPart}
        allCompletedAction={
          allMissionsCompleted
            ? {
                label: 'Buka Sijil Pencapaian',
                onClick: handleOpenCertificate,
              }
            : undefined
        }
        className="no-print"
      />

      {/* Active Activity Canvas (Bahagian A, B, C) OR Separated Bahagian D Certificate Display */}
      {!isCertificateOpen && (
      <section className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-8 shadow-sm">
        {/* BAHAGIAN A: FINAL POKÉMON CHALLENGE */}
        {activeTab === 'A' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-amber-700 mb-1">
                  Aktiviti A · Final Pokémon Challenge
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  CABARAN AKHIR PELATIH!
                </h2>
              </div>
              <div className="text-sm font-semibold text-slate-700 tabular-nums">
                Soalan dijawab:{' '}
                <span className="font-bold text-emerald-700">{answeredFinalCount} / 5</span>
              </div>
            </div>

            <CharacterDialogue
              character="eevee"
              message="Hai Pelatih! Saya Eevee, penjaga Menara Juara Kebersihan! Jawab kelima-lima soalan dengan tepat untuk membuktikan penguasaan kamu!"
            />

            <div className="space-y-5">
              {PHASE5_FINAL_QUESTIONS.map((q) => {
                const selected = progress.finalAnswers[q.id];
                const isCorrect = progress.finalSubmitted && selected === q.correctAnswer;
                const isWrong = progress.finalSubmitted && selected !== q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border p-5 space-y-4 bg-white ${
                      isCorrect
                        ? 'border-emerald-400 bg-emerald-50/35'
                        : isWrong
                          ? 'border-red-300 bg-red-50/35'
                          : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-bold text-slate-900">
                        Soalan {q.number}: {q.question}
                      </h3>
                      {progress.finalSubmitted && (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold shrink-0 ${
                            isCorrect ? 'text-emerald-700' : 'text-red-600'
                          }`}
                        >
                          {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          <span>{isCorrect ? 'Betul' : 'Perlu Ulang Kaji'}</span>
                        </span>
                      )}
                    </div>

                    {q.promptImageUrl && (
                      <div className="aspect-[4/3] max-w-xs rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                        <ResilientImage
                          src={q.promptImageUrl}
                          alt={q.promptImageAlt || 'Gambar soalan'}
                          fallbackTitle="Gambar Soalan"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    <div
                      className={`grid gap-3 ${
                        q.options.some((o) => o.imageUrl) ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1'
                      }`}
                    >
                      {q.options.map((opt) => {
                        const isPicked = selected === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            disabled={progress.finalSubmitted}
                            onClick={() => {
                              playClickPop();
                              onSelectFinalAnswer(q.id, opt.key);
                            }}
                            className={`rounded-2xl border p-3.5 text-left transition-all flex ${
                              opt.imageUrl ? 'flex-col gap-2.5 items-center' : 'items-center gap-3'
                            } min-h-[52px] ${
                              progress.finalSubmitted ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              isPicked
                                ? 'bg-sky-50 border-sky-600 ring-1 ring-sky-600 text-slate-900'
                                : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-sky-400 text-slate-900'
                            }`}
                          >
                            {opt.imageUrl && (
                              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-slate-100">
                                <ResilientImage
                                  src={opt.imageUrl}
                                  alt={opt.imageAlt || opt.label}
                                  fallbackTitle={opt.label}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex items-center gap-3 w-full">
                              <span
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold border shrink-0 ${
                                  isPicked
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-slate-700 border-slate-300'
                                }`}
                              >
                                {opt.key}
                              </span>
                              <span className="text-sm sm:text-base font-semibold">{opt.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-wrap items-center justify-between gap-3">
              {!progress.finalSubmitted ? (
                <>
                  <p className="text-sm text-slate-700">
                    {allFinalAnswered
                      ? 'Semua 5 soalan telah dipilih. Tekan Hantar Jawapan Akhir.'
                      : 'Pilih jawapan bagi kelima-lima soalan di atas.'}
                  </p>
                  <button
                    type="button"
                    disabled={!allFinalAnswered}
                    onClick={handleSubmitFinal}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-extrabold cursor-pointer min-h-[48px]"
                  >
                    <Send className="w-4 h-4" />
                    <span>HANTAR JAWAPAN AKHIR ({answeredFinalCount}/5)</span>
                  </button>
                </>
              ) : (
                <div className="w-full space-y-5">
                  <div
                    className={`rounded-2xl border p-5 space-y-2 ${
                      progress.finalScore >= 3
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}
                  >
                    <p className="font-display text-2xl font-extrabold tabular-nums">
                      Markah Akhir: {progress.finalScore} / 5
                    </p>
                    <p className="text-sm sm:text-base font-bold">
                      {progress.finalScore >= 3
                        ? 'Tahniah! Objektif pembelajaran dicapai (3 hingga 5 jawapan betul).'
                        : 'Murid memerlukan latihan pengukuhan (0 hingga 2 jawapan betul).'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-emerald-200 bg-white p-4 space-y-2">
                      <h4 className="font-display text-base font-bold text-emerald-800">
                        Perkataan Telah Dikuasai
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {progress.masteredWords.length === 0 ? (
                          <span className="text-xs text-slate-600">Tiada lagi.</span>
                        ) : (
                          progress.masteredWords.map((k) => (
                            <span
                              key={k}
                              className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-extrabold text-emerald-900"
                            >
                              {HYGIENE_WORD_MAP[k].word}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-amber-200 bg-white p-4 space-y-2">
                      <h4 className="font-display text-base font-bold text-amber-800">
                        Perkataan Perlu Diulang Kaji
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {progress.reviewWords.length === 0 ? (
                          <span className="text-xs font-semibold text-emerald-700">
                            Semua 5 perkataan sudah dikuasai!
                          </span>
                        ) : (
                          progress.reviewWords.map((k) => (
                            <span
                              key={k}
                              className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-extrabold text-amber-900"
                            >
                              {HYGIENE_WORD_MAP[k].word}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        playClickPop();
                        onRetryFinalChallenge();
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold cursor-pointer min-h-[44px]"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Cuba Semula</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectPart('B')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold cursor-pointer min-h-[44px]"
                    >
                      <span>Ke Bahagian B: Refleksi Murid</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BAHAGIAN B: REFLEKSI MURID */}
        {activeTab === 'B' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-red-700 mb-1">
                  Aktiviti B · Refleksi Murid
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  APA YANG SAYA PELAJARI HARI INI?
                </h2>
              </div>
            </div>

            <CharacterDialogue
              character="pikachu"
              message="Seronok tak belajar bersama Pokémon hari ini?"
            />

            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-900">1. Pilih tahap keyakinan kamu:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PHASE5_REFLECTION_FEELINGS.map((feeling) => {
                  const isSelected = progress.reflectionFeeling === feeling;
                  return (
                    <button
                      key={feeling}
                      type="button"
                      onClick={() => {
                        playSuccessChime();
                        onSaveReflection(feeling, progress.reflectionEasiestWord);
                      }}
                      className={`px-4 py-3.5 rounded-2xl border text-left text-sm sm:text-base font-semibold transition-colors cursor-pointer min-h-[52px] ${
                        isSelected
                          ? 'bg-yellow-100 border-yellow-500 text-slate-900 ring-1 ring-yellow-500'
                          : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-800'
                      }`}
                    >
                      {feeling}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-900">
                2. Apakah perkataan yang paling mudah kamu ingat?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {HYGIENE_OBJECTS.map((obj) => {
                  const isSelected = progress.reflectionEasiestWord === obj.key;
                  return (
                    <button
                      key={obj.key}
                      type="button"
                      onClick={() => {
                        playSuccessChime();
                        onSaveReflection(progress.reflectionFeeling, obj.key);
                      }}
                      className={`px-3 py-3 rounded-xl border font-display text-sm font-extrabold transition-colors cursor-pointer min-h-[48px] ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-900'
                      }`}
                    >
                      {obj.word}
                    </button>
                  );
                })}
              </div>
            </div>

            {reflectionMessage && (
              <CharacterDialogue character="pikachu" message={reflectionMessage} />
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-700">
                Terima kasih kerana berkongsi refleksi pembelajaran hari ini!
              </p>
              <button
                type="button"
                onClick={() => handleSelectPart('C')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold cursor-pointer min-h-[44px]"
              >
                <span>Ke Bahagian C: Rumusan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* BAHAGIAN C: RUMUSAN PEMBELAJARAN */}
        {activeTab === 'C' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-sky-700 mb-1">
                  Aktiviti C · Rumusan Pembelajaran
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  IMBAS KEMBALI LIMA PERKATAAN!
                </h2>
              </div>
              <button
                type="button"
                onClick={handleReviewAllWords}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 text-slate-900 text-xs sm:text-sm font-bold cursor-pointer min-h-[44px]"
              >
                <Volume2 className="w-4 h-4 text-amber-800" />
                <span>Ulang Kaji Lima Perkataan</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {HYGIENE_OBJECTS.map((obj) => (
                <button
                  key={obj.key}
                  type="button"
                  onClick={() => {
                    onMarkSummaryReviewed();
                    speakMalay(`${obj.word}. ${obj.usageDescription}`);
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-sky-400 p-3 text-center space-y-2.5 cursor-pointer transition-all"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-slate-100">
                    <ResilientImage
                      src={obj.imageUrl}
                      alt={obj.imageAlt}
                      fallbackTitle={obj.word}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-display text-sm sm:text-base font-extrabold text-slate-900">
                    {obj.word}
                  </p>
                </button>
              ))}
            </div>

            <CharacterDialogue
              character="pikachu"
              message="Hari ini kita telah belajar lima perkataan yang membantu kita menjaga kebersihan diri. Ingat, badan yang bersih menjadikan kita lebih sihat dan selesa!"
              actionSlot={
                allMissionsCompleted ? (
                  <button
                    type="button"
                    onClick={() => {
                      onMarkSummaryReviewed();
                      handleOpenCertificate();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
                  >
                    <Award className="w-4 h-4" />
                    <span>Buka Bahagian D: Sijil Pencapaian</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onMarkSummaryReviewed();
                      certGateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
                  >
                    <Lock className="w-4 h-4 text-amber-700" />
                    <span>Semak Syarat Sijil Pencapaian</span>
                  </button>
                )
              }
            />
          </div>
        )}
      </section>
      )}

      {/* SEPARATED BAHAGIAN D: SIJIL PENCAPAIAN (LOCKED UNTIL ALL MISSIONS COMPLETED) */}
      <section
        ref={certGateRef}
        aria-labelledby="bahagian-d-sijil-heading"
        className="space-y-6"
      >
        {!isCertificateOpen ? (
          <div
            className={`rounded-3xl border p-6 sm:p-8 shadow-sm space-y-5 no-print ${
              allMissionsCompleted
                ? 'bg-emerald-50/95 border-emerald-300'
                : 'bg-white/95 border-slate-200'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    allMissionsCompleted
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {allMissionsCompleted ? (
                    <FileBadge2 className="w-6 h-6" />
                  ) : (
                    <Lock className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-700">
                    Bahagian D (Paparan Khas) · Sijil Pencapaian Murid
                  </p>
                  <h2
                    id="bahagian-d-sijil-heading"
                    className="font-display text-xl sm:text-2xl font-extrabold text-slate-900"
                  >
                    {allMissionsCompleted
                      ? 'Tahniah! Sijil Pencapaian Kini Dibuka!'
                      : 'Sijil Pencapaian Masih Terkunci'}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {allMissionsCompleted
                      ? 'Kesemua misi dari Misi 1 hingga Misi 5 telah diselesaikan. Tekan butang di sebelah untuk membuka paparan Sijil Pencapaian.'
                      : 'Lengkapkan kesemua misi (Misi 1 hingga Misi 5 Bahagian A, B dan C) terlebih dahulu untuk membuka paparan sijil.'}
                  </p>
                </div>
              </div>

              {allMissionsCompleted ? (
                <button
                  type="button"
                  onClick={handleOpenCertificate}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold cursor-pointer min-h-[48px] whitespace-nowrap shrink-0 shadow-sm"
                >
                  <Award className="w-4 h-4" />
                  <span>Buka Paparan Sijil Pencapaian</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold whitespace-nowrap shrink-0">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Terkunci Sehingga Semua Misi Selesai</span>
                </span>
              )}
            </div>

            {!allMissionsCompleted && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                {missionChecklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onOpen}
                    className={`text-left rounded-2xl border p-3.5 transition-colors cursor-pointer flex flex-col justify-between gap-2 ${
                      item.done
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 hover:border-sky-400 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold">{item.label}</span>
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-sky-700">
                      {item.done ? 'Selesai' : 'Klik untuk lengkapkan →'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back to Misi 5 activities bar */}
            <div className="flex items-center justify-between gap-3 no-print">
              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  setShowCertificatePanel(false);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold cursor-pointer min-h-[42px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Aktiviti Misi 5 (A–C)</span>
              </button>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Semua Misi Lengkap (5/5)</span>
              </span>
            </div>

            {/* Student Name Form (hidden during print) */}
            <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4 no-print">
              <div>
                <p className="text-xs font-bold text-emerald-700 mb-1">
                  Bahagian D · Sijil Pencapaian Murid
                </p>
                <h2
                  id="bahagian-d-sijil-heading"
                  className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900"
                >
                  JANA SIJIL PENCAPAIAN MURID
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Masukkan nama penuh murid untuk menjana dan mencetak sijil rasmi pengembaraan.
                </p>
              </div>

              <form onSubmit={handleGenerateCert} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="certificate-student-name" className="sr-only">
                    Nama Murid
                  </label>
                  <input
                    id="certificate-student-name"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Masukkan nama murid (Contoh: Muhammad Haris)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm sm:text-base text-slate-900 min-h-[48px] focus:outline-none focus:border-sky-600"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold cursor-pointer min-h-[48px] whitespace-nowrap"
                >
                  <Award className="w-4 h-4" />
                  <span>Jana Sijil</span>
                </button>

                <button
                  type="button"
                  disabled={!progress.certificateGenerated}
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-800 text-sm font-bold cursor-pointer min-h-[48px] whitespace-nowrap"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Sijil</span>
                </button>
              </form>
              {nameError && <p className="text-xs font-bold text-red-600">{nameError}</p>}
            </div>

            {/* Printable Certificate Canvas */}
            <div className="print-certificate-only rounded-3xl bg-white border-4 border-amber-400 p-6 sm:p-10 shadow-md relative overflow-hidden">
              <div className="border-2 border-sky-200 rounded-2xl p-6 sm:p-9 space-y-6 text-center bg-gradient-to-b from-yellow-50/40 via-white to-sky-50/40">
                <div className="flex items-center justify-center gap-3">
                  <CharacterAvatar character="pikachu" size="sm" />
                  <CharacterAvatar character="squirtle" size="sm" />
                  <CharacterAvatar character="bulbasaur" size="sm" />
                  <CharacterAvatar character="charmander" size="sm" />
                  <CharacterAvatar character="eevee" size="sm" />
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs sm:text-sm font-bold text-sky-700 tracking-wide">
                    MISI KEBERSIHAN POKÉMON · BAHASA MELAYU TAHUN 2
                  </p>
                  <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                    POKÉMON HYGIENE TRAINER CERTIFICATE
                  </h3>
                </div>

                <div className="space-y-2 py-2">
                  <p className="text-sm text-slate-600">Sijil ini dianugerahkan kepada</p>
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-sky-800 border-b-2 border-slate-300 inline-block px-6 pb-1">
                    {progress.certificateGenerated && progress.studentName
                      ? progress.studentName
                      : nameInput.trim() || 'Nama Pelatih Kebersihan'}
                  </p>
                  <p className="text-sm text-slate-700 max-w-xl mx-auto pt-2 leading-relaxed">
                    kerana telah menyertai dan melengkapkan pembelajaran interaktif <strong>Jom Bersihkan Diri!</strong> dengan membaca serta memahami perkataan amalan kebersihan diri.
                  </p>
                </div>

                {/* Certificate Metrics + Badge */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-2">
                  <div className="md:col-span-4 flex justify-center">
                    <TrainerBadgeGraphic className="w-36 h-36 sm:w-40 sm:h-40" />
                  </div>

                  <div className="md:col-span-4 space-y-3 text-left bg-white/90 rounded-2xl border border-slate-200 p-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500">Tarikh Penyelesaian</p>
                      <p className="text-sm font-bold text-slate-900">{formattedCompletionDate}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Markah Pentaksiran Akhir</p>
                      <p className="text-sm font-extrabold text-sky-700 tabular-nums">
                        {progress.finalSubmitted ? `${progress.finalScore} / 5` : 'Belum dinilai'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Bilangan Perkataan Dikuasai</p>
                      <p className="text-sm font-extrabold text-emerald-700 tabular-nums">
                        {progress.finalSubmitted
                          ? `${progress.masteredWords.length} / 5 perkataan`
                          : '5 perkataan sasaran'}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-4">
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200 bg-white">
                      <ResilientImage
                        src={HERO_MEDIA.heroImage}
                        alt={HERO_MEDIA.heroAlt}
                        fallbackTitle="Pikachu, Eevee & Rakan Pokémon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Phase 5 Bottom Navigation (matches Misi 1) */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          type="button"
          onClick={onBackPhase4}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold cursor-pointer min-h-[46px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <HealBallIcon className="w-4 h-4" />
          <span>Kembali ke Misi 4</span>
        </button>

        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-extrabold transition-colors cursor-pointer min-h-[46px]"
        >
          <PokeBallIcon className="w-4 h-4" />
          <span>Kembali ke Halaman Utama</span>
        </button>
      </div>
    </div>
  );
};
