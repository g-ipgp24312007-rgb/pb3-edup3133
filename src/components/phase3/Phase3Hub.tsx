import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Gamepad2,
  Puzzle,
  RotateCcw,
  Send,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import {
  HYGIENE_OBJECTS,
  HYGIENE_WORD_MAP,
  PHASE3_ASSESSMENT_QUESTIONS,
  PHASE3_CATCH_QUESTIONS,
} from '../../data/phases2to5Data';
import { HygieneWordKey, Phase3ProgressState } from '../../types/learning';
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
  GreatBallIcon,
  HealBallIcon,
  PotionIcon,
  ResilientImage,
} from '../PokemonIcons';

interface Phase3HubProps {
  progress: Phase3ProgressState;
  onCompleteWordMatch: () => void;
  onRecordCatchScore: (score: number) => void;
  onSelectAssessmentAnswer: (qId: string, optionKey: 'A' | 'B' | 'C') => void;
  onSubmitAssessment: (score: number) => void;
  onResetAssessment: () => void;
  onBackPhase2: () => void;
  onNextPhase4: () => void;
}

type Phase3Tab = 'A' | 'B' | 'C' | 'D';

const SHUFFLED_WORD_CARDS: HygieneWordKey[] = ['tuala', 'sabun', 'sikat', 'berus-gigi', 'syampu'];

export const Phase3Hub: React.FC<Phase3HubProps> = ({
  progress,
  onCompleteWordMatch,
  onRecordCatchScore,
  onSelectAssessmentAnswer,
  onSubmitAssessment,
  onResetAssessment,
  onBackPhase2,
  onNextPhase4,
}) => {
  const [activeTab, setActiveTab] = useState<Phase3Tab>('A');

  // --- Part A: Pokémon Word Match State ---
  const [selectedWordKey, setSelectedWordKey] = useState<HygieneWordKey | null>(null);
  const [matchedKeys, setMatchedKeys] = useState<HygieneWordKey[]>([]);
  const [matchFeedback, setMatchFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // --- Part B: Tangkap Perkataan Pokémon State ---
  const [catchIndex, setCatchIndex] = useState<number>(0);
  const [catchSelected, setCatchSelected] = useState<string>('');
  const [catchScore, setCatchScore] = useState<number>(0);
  const [catchFinished, setCatchFinished] = useState<boolean>(false);

  // --- Part C: E-Pentaksiran 10 Soalan State ---
  const [quizIdx, setQuizIdx] = useState<number>(0);

  const handleSelectPart = (part: Phase3Tab) => {
    playClickPop();
    setActiveTab(part);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Part A Handlers
  const attemptMatch = (wordKey: HygieneWordKey, targetPictureKey: HygieneWordKey) => {
    if (matchedKeys.includes(targetPictureKey)) return;
    if (wordKey === targetPictureKey) {
      const next = [...matchedKeys, targetPictureKey];
      setMatchedKeys(next);
      setSelectedWordKey(null);
      const wordLabel = HYGIENE_WORD_MAP[wordKey].word;
      setMatchFeedback({ type: 'ok', text: `Betul! Gambar ini ialah ${wordLabel}.` });
      playSuccessChime();
      if (next.length === HYGIENE_OBJECTS.length) {
        onCompleteWordMatch();
        playVictoryFanfare();
      }
    } else {
      setMatchFeedback({ type: 'err', text: 'Belum tepat! Cuba padankan perkataan lain.' });
      playTryAgainTone();
    }
  };

  const resetWordMatch = () => {
    setMatchedKeys([]);
    setSelectedWordKey(null);
    setMatchFeedback(null);
    playClickPop();
  };

  // Part B Handlers
  const currentCatchQ = PHASE3_CATCH_QUESTIONS[catchIndex];
  const handlePickCatchOption = (opt: string) => {
    if (catchSelected) return;
    setCatchSelected(opt);
    if (opt === currentCatchQ.correctAnswer) {
      setCatchScore((s) => s + 1);
      playSuccessChime();
    } else {
      playTryAgainTone();
    }
  };

  const handleNextCatch = () => {
    if (catchIndex + 1 < PHASE3_CATCH_QUESTIONS.length) {
      setCatchIndex((i) => i + 1);
      setCatchSelected('');
      playClickPop();
    } else {
      setCatchFinished(true);
      onRecordCatchScore(catchScore);
      playVictoryFanfare();
    }
  };

  const handleResetCatch = () => {
    setCatchIndex(0);
    setCatchSelected('');
    setCatchScore(0);
    setCatchFinished(false);
    playClickPop();
  };

  // Part C & D Handlers
  const currentAssessmentQ = PHASE3_ASSESSMENT_QUESTIONS[quizIdx];
  const answeredTotal = PHASE3_ASSESSMENT_QUESTIONS.filter(
    (q) => Boolean(progress.assessmentAnswers[q.id])
  ).length;
  const allAssessmentAnswered = answeredTotal === PHASE3_ASSESSMENT_QUESTIONS.length;

  const handleSubmitAssessment = () => {
    if (!allAssessmentAnswered) return;
    const score = PHASE3_ASSESSMENT_QUESTIONS.reduce(
      (acc, q) => acc + (progress.assessmentAnswers[q.id] === q.correctAnswer ? 1 : 0),
      0
    );
    onSubmitAssessment(score);
    playVictoryFanfare();
    handleSelectPart('D');
  };

  const assessmentBreakdown = useMemo(() => {
    const score = PHASE3_ASSESSMENT_QUESTIONS.reduce(
      (acc, q) => acc + (progress.assessmentAnswers[q.id] === q.correctAnswer ? 1 : 0),
      0
    );
    const wrongCount = PHASE3_ASSESSMENT_QUESTIONS.length - score;

    const masteredWords: HygieneWordKey[] = [];
    const needPracticeWords: HygieneWordKey[] = [];

    HYGIENE_OBJECTS.forEach((obj) => {
      const wordQs = PHASE3_ASSESSMENT_QUESTIONS.filter((q) => q.targetWord === obj.key);
      const allWordCorrect = wordQs.every(
        (q) => progress.assessmentAnswers[q.id] === q.correctAnswer
      );
      if (allWordCorrect) {
        masteredWords.push(obj.key);
      } else {
        needPracticeWords.push(obj.key);
      }
    });

    let rankTitle = 'Teruskan latihan!';
    if (score >= 9) rankTitle = 'Pokémon Master!';
    else if (score >= 7) rankTitle = 'Pokémon Expert!';
    else if (score >= 5) rankTitle = 'Pokémon Pelatih!';

    return { score, wrongCount, masteredWords, needPracticeWords, rankTitle };
  }, [progress.assessmentAnswers]);

  const partsConfig: PhasePartConfig<Phase3Tab>[] = [
    {
      id: 'A',
      code: 'Bahagian A',
      title: 'Word Match',
      subtitle: 'Padankan 5 perkataan',
      icon: <Puzzle className="w-5 h-5 text-sky-600" />,
      completed: progress.wordMatchCompleted,
    },
    {
      id: 'B',
      code: 'Bahagian B',
      title: 'Tangkap Perkataan',
      subtitle: '5 soalan kuiz pantas',
      icon: <Gamepad2 className="w-5 h-5 text-amber-600" />,
      completed: progress.catchCompleted,
    },
    {
      id: 'C',
      code: 'Bahagian C',
      title: 'E-Pentaksiran',
      subtitle: '10 soalan penguasaan',
      icon: <ClipboardCheck className="w-5 h-5 text-red-600" />,
      completed: progress.assessmentSubmitted,
    },
    {
      id: 'D',
      code: 'Bahagian D',
      title: 'Papan Skor',
      subtitle: 'Tahap & perkataan dikuasai',
      icon: <Trophy className="w-5 h-5 text-emerald-600" />,
      completed: progress.assessmentSubmitted,
    },
  ];

  return (
    <div className="space-y-8 pb-14">
      {/* Phase 3 Mission Header & Progress Tracker (matches Misi 1) */}
      <PhaseMissionHubHeader
        phaseEyebrow="Fasa 3 · Permainan Interaktif & E-Pentaksiran"
        missionTitle="MISI 3: CABARAN POKÉMON"
        progressLabel="Kemajuan Fasa 3"
        parts={partsConfig}
        activePart={activeTab}
        onSelectPart={handleSelectPart}
        allCompletedAction={{
          label: 'Ke Misi 4',
          onClick: onNextPhase4,
        }}
      />

      {/* Active Activity Canvas (matches Misi 1) */}
      <section className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-8 shadow-sm">
        {/* BAHAGIAN A: POKÉMON WORD MATCH */}
        {activeTab === 'A' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-sky-700 mb-1">
                  Aktiviti A · Pokémon Word Match
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  PADANKAN PERKATAAN DAN GAMBAR!
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700 tabular-nums">
                  Padanan betul:{' '}
                  <span className="text-emerald-700 font-bold">{matchedKeys.length} / 5</span>
                </span>
                <button
                  type="button"
                  onClick={resetWordMatch}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 cursor-pointer min-h-[40px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cuba Semula</span>
                </button>
              </div>
            </div>

            <CharacterDialogue
              character="pikachu"
              message="Padankan perkataan dengan gambar yang betul!"
            />

            {matchFeedback && (
              <div
                className={`rounded-2xl border p-3.5 text-sm font-bold flex items-center gap-2 ${
                  matchFeedback.type === 'ok'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                {matchFeedback.type === 'ok' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span>{matchFeedback.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* 5 Word Cards (Draggable or Clickable) */}
              <div className="lg:col-span-4 space-y-3">
                <p className="text-xs font-bold text-slate-600">1. Pilih atau Seret Kad Perkataan:</p>
                {SHUFFLED_WORD_CARDS.map((key) => {
                  const item = HYGIENE_WORD_MAP[key];
                  const isMatched = matchedKeys.includes(key);
                  const isSelected = selectedWordKey === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={isMatched}
                      draggable={!isMatched}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', key);
                        setSelectedWordKey(key);
                      }}
                      onClick={() => {
                        playClickPop();
                        setSelectedWordKey((prev) => (prev === key ? null : key));
                      }}
                      className={`w-full px-4 py-3.5 rounded-2xl border font-display text-lg font-extrabold tracking-wide transition-all flex items-center justify-between min-h-[54px] ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-75 cursor-default'
                          : isSelected
                            ? 'bg-yellow-100 border-yellow-500 text-slate-900 ring-2 ring-yellow-400 cursor-grab'
                            : 'bg-slate-50 border-slate-300 text-slate-900 hover:border-sky-400 hover:bg-white cursor-grab'
                      }`}
                    >
                      <span>{item.word}</span>
                      {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>

              {/* 5 Picture Drop Targets */}
              <div className="lg:col-span-8 space-y-3">
                <p className="text-xs font-bold text-slate-600">2. Lepaskan atau Klik Gambar Yang Sepadan:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {HYGIENE_OBJECTS.map((obj) => {
                    const isMatched = matchedKeys.includes(obj.key);

                    return (
                      <div
                        key={obj.key}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const dragged = e.dataTransfer.getData('text/plain') as HygieneWordKey;
                          if (dragged) attemptMatch(dragged, obj.key);
                        }}
                        onClick={() => {
                          if (selectedWordKey) {
                            attemptMatch(selectedWordKey, obj.key);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ' ') && selectedWordKey) {
                            e.preventDefault();
                            attemptMatch(selectedWordKey, obj.key);
                          }
                        }}
                        className={`rounded-2xl border overflow-hidden transition-all cursor-pointer bg-white ${
                          isMatched
                            ? 'border-emerald-400 ring-2 ring-emerald-200'
                            : selectedWordKey
                              ? 'border-sky-400 hover:ring-2 hover:ring-sky-200'
                              : 'border-slate-200'
                        }`}
                      >
                        <div className="aspect-[4/3] bg-slate-50">
                          <ResilientImage
                            src={obj.imageUrl}
                            alt={obj.imageAlt}
                            fallbackTitle="Objek Kebersihan"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 text-center">
                          {isMatched ? (
                            <span className="inline-flex items-center gap-1.5 font-display text-sm font-extrabold text-emerald-700">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{obj.word}</span>
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-slate-500">
                              {selectedWordKey ? 'Klik untuk padankan' : 'Pilih perkataan dahulu'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 flex items-center gap-3.5">
              <CharacterAvatar character="squirtle" size="sm" />
              <p className="text-sm text-slate-800">
                <span className="font-bold text-sky-800">Squirtle:</span> Kamu boleh seret kad perkataan atau hanya klik perkataan kemudian klik gambarnya!
              </p>
            </div>

            {(matchedKeys.length === 5 || progress.wordMatchCompleted) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CharacterDialogue
                  character="pikachu"
                  message="Tahniah Pelatih! Semua 5 padanan gambar dan perkataan berjaya diselesaikan!"
                  actionSlot={
                    <button
                      type="button"
                      onClick={() => handleSelectPart('B')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
                    >
                      <span>Ke Bahagian B: Tangkap Perkataan</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  }
                />
              </motion.div>
            )}
          </div>
        )}

        {/* BAHAGIAN B: TANGKAP PERKATAAN POKÉMON */}
        {activeTab === 'B' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-amber-700 mb-1">
                  Aktiviti B · Tangkap Perkataan Pokémon
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  TANGKAP PERKATAAN YANG BETUL!
                </h2>
              </div>
              <div className="text-sm font-semibold text-slate-700 tabular-nums">
                Skor semasa:{' '}
                <span className="font-bold text-sky-700">
                  {catchScore} / {PHASE3_CATCH_QUESTIONS.length}
                </span>
              </div>
            </div>

            <CharacterDialogue
              character="pikachu"
              message="Lihat gambar objek kebersihan diri dan tangkap perkataan yang betul daripada tiga pilihan!"
            />

            {!catchFinished ? (
              <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-7 space-y-5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 tabular-nums">
                  <span>Soalan {catchIndex + 1} daripada {PHASE3_CATCH_QUESTIONS.length}</span>
                  <span>Pilih 1 Jawapan</span>
                </div>

                <div className="aspect-[4/3] max-h-[280px] mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-white">
                  <ResilientImage
                    src={currentCatchQ.imageUrl}
                    alt={currentCatchQ.imageAlt}
                    fallbackTitle="Gambar Objek"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentCatchQ.options.map((opt, idx) => {
                    const letter = ['A', 'B', 'C'][idx];
                    const isPicked = catchSelected === opt;
                    const isCorrect = opt === currentCatchQ.correctAnswer;

                    let btnClass = 'bg-white border-slate-300 hover:border-sky-500 text-slate-900';
                    if (catchSelected) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-950';
                      } else if (isPicked) {
                        btnClass = 'bg-red-50 border-red-400 text-red-900';
                      } else {
                        btnClass = 'bg-white border-slate-200 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={Boolean(catchSelected)}
                        onClick={() => handlePickCatchOption(opt)}
                        className={`px-4 py-3.5 rounded-2xl border font-display text-base font-extrabold transition-colors flex items-center justify-center gap-2 min-h-[54px] ${
                          catchSelected ? 'cursor-default' : 'cursor-pointer'
                        } ${btnClass}`}
                      >
                        <span className="text-xs font-bold text-slate-500">{letter}.</span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {catchSelected && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <p
                      className={`text-sm font-bold ${
                        catchSelected === currentCatchQ.correctAnswer
                          ? 'text-emerald-700'
                          : 'text-red-700'
                      }`}
                    >
                      {catchSelected === currentCatchQ.correctAnswer
                        ? `Pika! Betul! Ini ialah ${currentCatchQ.correctAnswer}.`
                        : `Jawapan yang betul ialah ${currentCatchQ.correctAnswer}.`}
                    </p>
                    <button
                      type="button"
                      onClick={handleNextCatch}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold cursor-pointer min-h-[44px]"
                    >
                      <span>
                        {catchIndex + 1 < PHASE3_CATCH_QUESTIONS.length
                          ? 'Soalan Seterusnya'
                          : 'Lihat Skor'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-xl mx-auto rounded-3xl border border-emerald-300 bg-emerald-50/70 p-6 sm:p-8 text-center space-y-5">
                <Trophy className="w-14 h-14 text-amber-500 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-display text-2xl font-extrabold text-slate-900">
                    Syabas! Permainan Tamat!
                  </h3>
                  <p className="text-lg font-bold text-emerald-800 tabular-nums">
                    Skor Kamu: {catchScore} / {PHASE3_CATCH_QUESTIONS.length}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetCatch}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold cursor-pointer min-h-[44px]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Main Semula</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPart('C')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold cursor-pointer min-h-[44px]"
                  >
                    <span>Ke E-Pentaksiran (10 Soalan)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center gap-3.5">
              <CharacterAvatar character="bulbasaur" size="sm" />
              <p className="text-sm text-slate-800">
                <span className="font-bold text-emerald-800">Bulbasaur:</span> Perhatikan ciri objek pada gambar sebelum menangkap perkataan yang tepat!
              </p>
            </div>
          </div>
        )}

        {/* BAHAGIAN C: E-PENTAKSIRAN (10 SOALAN) */}
        {activeTab === 'C' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-red-700 mb-1">
                  Aktiviti C · E-Pentaksiran (10 Soalan)
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  UJIAN POKÉMON HYGIENE TRAINER
                </h2>
              </div>
              <div className="text-sm font-semibold text-slate-700 tabular-nums">
                Soalan {quizIdx + 1} / 10 · Dijawab:{' '}
                <span className="font-bold text-sky-700">{answeredTotal} / 10</span>
              </div>
            </div>

            <CharacterDialogue
              character="pikachu"
              message="Jawab kesemua 10 soalan dengan teliti. Kamu boleh klik nombor soalan untuk menyemak semula sebelum menghantar ujian!"
            />

            {/* Question Progress Bar & Quick Number Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              {PHASE3_ASSESSMENT_QUESTIONS.map((q, idx) => {
                const isCurrent = idx === quizIdx;
                const isAnswered = Boolean(progress.assessmentAnswers[q.id]);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      playClickPop();
                      setQuizIdx(idx);
                    }}
                    className={`w-9 h-9 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer tabular-nums ${
                      isCurrent
                        ? 'bg-slate-900 text-white border-slate-900'
                        : isAnswered
                          ? 'bg-sky-50 text-sky-800 border-sky-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {q.number}
                  </button>
                );
              })}
            </div>

            {/* Active Question Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-7 space-y-5">
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
                Soalan {currentAssessmentQ.number}: {currentAssessmentQ.question}
              </h3>

              {currentAssessmentQ.promptImageUrl && (
                <div className="aspect-[4/3] max-w-xs rounded-2xl overflow-hidden border border-slate-200 bg-white">
                  <ResilientImage
                    src={currentAssessmentQ.promptImageUrl}
                    alt={currentAssessmentQ.promptImageAlt || 'Gambar soalan'}
                    fallbackTitle="Gambar Soalan"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div
                className={`grid gap-3 ${
                  currentAssessmentQ.options.some((o) => o.imageUrl)
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {currentAssessmentQ.options.map((opt) => {
                  const isSelected = progress.assessmentAnswers[currentAssessmentQ.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      disabled={progress.assessmentSubmitted}
                      onClick={() => {
                        playClickPop();
                        onSelectAssessmentAnswer(currentAssessmentQ.id, opt.key);
                      }}
                      className={`rounded-2xl border p-4 text-left transition-all flex ${
                        opt.imageUrl ? 'flex-col gap-3 items-center' : 'items-center gap-3.5'
                      } min-h-[54px] ${
                        progress.assessmentSubmitted ? 'cursor-default' : 'cursor-pointer'
                      } ${
                        isSelected
                          ? 'bg-sky-50 border-sky-600 ring-1 ring-sky-600 text-slate-900'
                          : 'bg-white border-slate-200 hover:border-sky-400 text-slate-900'
                      }`}
                    >
                      {opt.imageUrl && (
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
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
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-700 border-slate-300'
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

            {/* Prev / Next / Submit Row */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={quizIdx === 0}
                  onClick={() => {
                    playClickPop();
                    setQuizIdx((i) => Math.max(0, i - 1));
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white disabled:opacity-40 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sebelum</span>
                </button>
                <button
                  type="button"
                  disabled={quizIdx === PHASE3_ASSESSMENT_QUESTIONS.length - 1}
                  onClick={() => {
                    playClickPop();
                    setQuizIdx((i) => Math.min(PHASE3_ASSESSMENT_QUESTIONS.length - 1, i + 1));
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white disabled:opacity-40 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer min-h-[44px]"
                >
                  <span>Seterusnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {!progress.assessmentSubmitted ? (
                <button
                  type="button"
                  disabled={!allAssessmentAnswered}
                  onClick={handleSubmitAssessment}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-extrabold cursor-pointer min-h-[48px]"
                >
                  <Send className="w-4 h-4" />
                  <span>HANTAR UJIAN ({answeredTotal}/10)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSelectPart('D')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold cursor-pointer min-h-[48px]"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Lihat Papan Skor</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* BAHAGIAN D: PAPAN SKOR POKÉMON */}
        {activeTab === 'D' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-700 mb-1">
                  Aktiviti D · Papan Skor Pokémon
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  KEPUTUSAN CABARAN POKÉMON
                </h2>
              </div>
              {progress.assessmentSubmitted && (
                <div className="text-sm font-semibold text-slate-700 tabular-nums">
                  Markah:{' '}
                  <span className="font-bold text-sky-700">{assessmentBreakdown.score} / 10</span>
                </div>
              )}
            </div>

            {!progress.assessmentSubmitted ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center space-y-4">
                <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-extrabold text-slate-900">
                    Papan Skor Pokémon Menanti Kamu!
                  </h3>
                  <p className="text-sm text-slate-600">
                    Sila jawab dan hantar 10 soalan dalam Bahagian C untuk melihat keputusan dan tahap penguasaan perkataan anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectPart('C')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold cursor-pointer min-h-[46px]"
                >
                  <span>Buka E-Pentaksiran (10 Soalan)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-3xl border border-yellow-300 bg-yellow-50/70 p-6 sm:p-8 text-center space-y-3">
                  <Award className="w-14 h-14 text-amber-600 mx-auto" />
                  <p className="text-xs font-bold text-amber-800">Keputusan Cabaran Pokémon</p>
                  <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {assessmentBreakdown.rankTitle}
                  </h3>
                  <p className="font-display text-2xl font-extrabold text-sky-700 tabular-nums">
                    Markah: {assessmentBreakdown.score} / 10
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 flex items-center gap-3.5">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">Jawapan Betul</p>
                      <p className="font-display text-2xl font-extrabold text-slate-900 tabular-nums">
                        {assessmentBreakdown.score} soalan
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5 flex items-center gap-3.5">
                    <XCircle className="w-8 h-8 text-red-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-red-800">Jawapan Salah</p>
                      <p className="font-display text-2xl font-extrabold text-slate-900 tabular-nums">
                        {assessmentBreakdown.wrongCount} soalan
                      </p>
                    </div>
                  </div>
                </div>

                {/* Word Mastery Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="rounded-2xl border border-emerald-200 bg-white p-5 space-y-3">
                    <h4 className="font-display text-lg font-bold text-emerald-800">
                      Perkataan Yang Telah Dikuasai
                    </h4>
                    {assessmentBreakdown.masteredWords.length === 0 ? (
                      <p className="text-sm text-slate-600">
                        Belum ada perkataan dikuasai sepenuhnya. Cuba ulang kaji dan cuba semula!
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {assessmentBreakdown.masteredWords.map((key) => {
                          const obj = HYGIENE_WORD_MAP[key];
                          return (
                            <li
                              key={key}
                              className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5"
                            >
                              <span className="font-display font-extrabold text-slate-900">{obj.word}</span>
                              <button
                                type="button"
                                onClick={() => speakMalay(obj.word)}
                                className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                              >
                                Sebut
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-white p-5 space-y-3">
                    <h4 className="font-display text-lg font-bold text-amber-800">
                      Perkataan Perlu Dilatih Semula
                    </h4>
                    {assessmentBreakdown.needPracticeWords.length === 0 ? (
                      <p className="text-sm text-emerald-700 font-semibold">
                        Syabas! Kesemua lima perkataan sasaran telah dikuasai dengan cemerlang!
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {assessmentBreakdown.needPracticeWords.map((key) => {
                          const obj = HYGIENE_WORD_MAP[key];
                          return (
                            <li
                              key={key}
                              className="flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5"
                            >
                              <div>
                                <p className="font-display font-extrabold text-slate-900">{obj.word}</p>
                                <p className="text-xs text-slate-700">{obj.usageDescription}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => speakMalay(`${obj.word}. ${obj.usageDescription}`)}
                                className="text-xs font-bold text-amber-900 hover:underline cursor-pointer shrink-0 ml-2"
                              >
                                Dengar
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>

                <CharacterDialogue
                  character="charmander"
                  message={
                    assessmentBreakdown.score >= 7
                      ? 'Syabas Pelatih! Prestasi kamu sangat cemerlang. Teruskan ke Misi 4!'
                      : 'Jangan berputus asa! Kamu boleh menekan perkataan yang perlu dilatih atau cuba semula ujian bila-bila masa.'
                  }
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onResetAssessment();
                      setQuizIdx(0);
                      handleSelectPart('C');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold cursor-pointer min-h-[44px]"
                  >
                    <PotionIcon className="w-4 h-4" />
                    <span>Cuba Semula Ujian</span>
                  </button>

                  <button
                    type="button"
                    onClick={onNextPhase4}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold cursor-pointer min-h-[46px]"
                  >
                    <HealBallIcon className="w-4 h-4" />
                    <span>Teruskan ke Misi 4</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Phase 3 Bottom Navigation (matches Misi 1) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackPhase2}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold cursor-pointer min-h-[46px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <GreatBallIcon className="w-4 h-4" />
          <span>Kembali ke Misi 2</span>
        </button>

        <button
          type="button"
          onClick={onNextPhase4}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-extrabold transition-colors cursor-pointer min-h-[46px]"
        >
          <HealBallIcon className="w-4 h-4" />
          <span>Seterusnya: Misi 4 (Aplikasi)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
