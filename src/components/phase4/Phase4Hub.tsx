import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  HelpCircle,
  Layers,
  PenTool,
  RotateCcw,
  Sparkles,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  HYGIENE_OBJECTS,
  HYGIENE_WORD_MAP,
  PHASE4_SENTENCES,
  PHASE4_SITUATIONS,
} from '../../data/phases2to5Data';
import { HygieneWordKey, Phase4ProgressState } from '../../types/learning';
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
  EeveeIcon,
  ResilientImage,
  UltraBallIcon,
} from '../PokemonIcons';

interface Phase4HubProps {
  progress: Phase4ProgressState;
  onCompleteSituations: () => void;
  onCompleteSentences: () => void;
  onCompletePath: (path: 'bimbingan' | 'lanjutan') => void;
  onBackPhase3: () => void;
  onNextPhase5: () => void;
}

type Phase4Tab = 'A' | 'B' | 'C';

const ENRICHMENT_CHALLENGES = [
  {
    question:
      'Selepas pulang dari padang bola, tangan Amir berpeluh dan kotor. Apakah objek yang patut Amir gunakan?',
    options: ['Sabun', 'Sikat', 'Tuala'],
    correct: 'Sabun',
  },
  {
    question:
      'Rambut Aisyah basah selepas mandi dan perlu dilap kering sebelum disikat. Apakah dua objek yang diperlukan mengikut urutan?',
    options: [
      'Tuala kemudian sikat',
      'Syampu kemudian berus gigi',
      'Sabun kemudian sikat',
    ],
    correct: 'Tuala kemudian sikat',
  },
  {
    question:
      'Lengkapkan ayat: Sebelum tidur malam, kita perlu menggosok gigi menggunakan ______ supaya gigi sentiasa sihat.',
    options: ['syampu', 'berus gigi', 'tuala'],
    correct: 'berus gigi',
  },
];

export const Phase4Hub: React.FC<Phase4HubProps> = ({
  progress,
  onCompleteSituations,
  onCompleteSentences,
  onCompletePath,
  onBackPhase3,
  onNextPhase5,
}) => {
  const [activeTab, setActiveTab] = useState<Phase4Tab>('A');

  // --- Part A: Situasi Bantu Pokémon State ---
  const [situationIdx, setSituationIdx] = useState<number>(0);
  const [situationPicked, setSituationPicked] = useState<HygieneWordKey | null>(null);
  const [situationsSolvedCount, setSituationsSolvedCount] = useState<number>(0);

  // --- Part B: Bina Ayat State ---
  const [sentenceAnswers, setSentenceAnswers] = useState<Record<string, HygieneWordKey>>({});
  const [sentencesSubmitted, setSentencesSubmitted] = useState<boolean>(false);

  // --- Part C: Differentiated Pathways State ---
  const [selectedPath, setSelectedPath] = useState<'bimbingan' | 'lanjutan'>('bimbingan');
  const [remedialIdx, setRemedialIdx] = useState<number>(0);
  const [remedialPicked, setRemedialPicked] = useState<HygieneWordKey | null>(null);
  const [showRemedialClue, setShowRemedialClue] = useState<boolean>(false);
  const [enrichmentAnswers, setEnrichmentAnswers] = useState<Record<number, string>>({});
  const [enrichmentSubmitted, setEnrichmentSubmitted] = useState<boolean>(false);

  const handleSelectPart = (part: Phase4Tab) => {
    playClickPop();
    setActiveTab(part);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Part A Handlers
  const currentSit = PHASE4_SITUATIONS[situationIdx];
  const handlePickSituationObject = (wordKey: HygieneWordKey) => {
    if (situationPicked === currentSit.correctWord) return;
    setSituationPicked(wordKey);
    if (wordKey === currentSit.correctWord) {
      playSuccessChime();
      if (situationIdx === PHASE4_SITUATIONS.length - 1) {
        onCompleteSituations();
      }
    } else {
      playTryAgainTone();
    }
  };

  const handleNextSituation = () => {
    setSituationsSolvedCount((c) => Math.max(c, situationIdx + 1));
    if (situationIdx + 1 < PHASE4_SITUATIONS.length) {
      setSituationIdx((i) => i + 1);
      setSituationPicked(null);
      playClickPop();
    }
  };

  // Part C Handlers
  const allSentencesFilled = PHASE4_SENTENCES.every((s) => Boolean(sentenceAnswers[s.id]));
  const allSentencesCorrect = PHASE4_SENTENCES.every(
    (s) => sentenceAnswers[s.id] === s.correctWord
  );

  const handleSubmitSentences = () => {
    if (!allSentencesFilled) return;
    setSentencesSubmitted(true);
    if (allSentencesCorrect) {
      onCompleteSentences();
      playVictoryFanfare();
    } else {
      playTryAgainTone();
    }
  };

  // Part D Data
  const currentRemedialObj = HYGIENE_OBJECTS[remedialIdx];
  const remedialSecondChoice =
    HYGIENE_OBJECTS[(remedialIdx + 2) % HYGIENE_OBJECTS.length];
  const remedialChoices =
    remedialIdx % 2 === 0
      ? [currentRemedialObj, remedialSecondChoice]
      : [remedialSecondChoice, currentRemedialObj];

  const partsConfig: PhasePartConfig<Phase4Tab>[] = [
    {
      id: 'A',
      code: 'Bahagian A',
      title: 'Bantu Pokémon',
      subtitle: '5 situasi kebersihan',
      icon: <Compass className="w-5 h-5 text-emerald-600" />,
      completed: progress.situationsCompleted,
    },
    {
      id: 'B',
      code: 'Bahagian B',
      title: 'Bina Ayat Mudah',
      subtitle: '5 ayat bergambar',
      icon: <PenTool className="w-5 h-5 text-amber-600" />,
      completed: progress.sentencesCompleted,
    },
    {
      id: 'C',
      code: 'Bahagian C',
      title: 'Laluan Latihan',
      subtitle: 'Bimbingan & lanjutan',
      icon: <Layers className="w-5 h-5 text-red-600" />,
      completed: progress.remedialCompleted || progress.enrichmentCompleted,
    },
  ];

  return (
    <div className="space-y-8 pb-14">
      {/* Phase 4 Mission Header & Progress Tracker (matches Misi 1) */}
      <PhaseMissionHubHeader
        phaseEyebrow="Fasa 4 · Aplikasi Kehidupan Harian"
        missionTitle="MISI 4: APLIKASI KEBERSIHAN DIRI"
        progressLabel="Kemajuan Fasa 4"
        parts={partsConfig}
        activePart={activeTab}
        onSelectPart={handleSelectPart}
        allCompletedAction={{
          label: 'Ke Misi 5',
          onClick: onNextPhase5,
        }}
      />

      {/* Active Activity Canvas (matches Misi 1) */}
      <section className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-8 shadow-sm">
        {/* BAHAGIAN A: BANTU POKÉMON BERSIHKAN DIRI! */}
        {activeTab === 'A' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-700 mb-1">
                  Aktiviti A · Bantu Pokémon Bersihkan Diri!
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  PILIH OBJEK YANG BETUL!
                </h2>
              </div>
              <div className="text-sm font-semibold text-slate-700 tabular-nums">
                Situasi{' '}
                <span className="font-bold text-sky-700">
                  {situationIdx + 1} / {PHASE4_SITUATIONS.length}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-5 flex items-center gap-4">
              <CharacterAvatar character={currentSit.character} size="lg" />
              <p className="font-display text-lg sm:text-xl font-bold text-slate-900">
                {currentSit.situation}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {HYGIENE_OBJECTS.map((obj) => {
                const isPicked = situationPicked === obj.key;
                const isCorrect = isPicked && obj.key === currentSit.correctWord;
                const isWrong = isPicked && obj.key !== currentSit.correctWord;

                return (
                  <button
                    key={obj.key}
                    type="button"
                    onClick={() => handlePickSituationObject(obj.key)}
                    className={`rounded-2xl border p-3 text-center transition-all cursor-pointer flex flex-col items-center gap-2.5 bg-white ${
                      isCorrect
                        ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50'
                        : isWrong
                          ? 'border-red-400 bg-red-50'
                          : 'border-slate-200 hover:border-sky-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-50">
                      <ResilientImage
                        src={obj.imageUrl}
                        alt={obj.imageAlt}
                        fallbackTitle={obj.word}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-display text-sm font-extrabold text-slate-900">
                      {obj.word}
                    </span>
                  </button>
                );
              })}
            </div>

            {situationPicked && (
              <div
                className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  situationPicked === currentSit.correctWord
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <p className="text-sm sm:text-base font-bold">
                  {situationPicked === currentSit.correctWord
                    ? currentSit.feedback
                    : 'Belum tepat! Cuba pilih objek kebersihan yang sesuai untuk situasi ini.'}
                </p>

                {situationPicked === currentSit.correctWord &&
                  (situationIdx + 1 < PHASE4_SITUATIONS.length ? (
                    <button
                      type="button"
                      onClick={handleNextSituation}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold cursor-pointer min-h-[44px] shrink-0"
                    >
                      <span>Situasi Seterusnya</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSituationIdx(0);
                        setSituationPicked(null);
                        handleSelectPart('B');
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold cursor-pointer min-h-[44px] shrink-0"
                    >
                      <span>Ke Bahagian B: Bina Ayat</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ))}
              </div>
            )}

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center gap-3.5">
              <CharacterAvatar character="bulbasaur" size="sm" />
              <p className="text-sm text-slate-800">
                <span className="font-bold text-emerald-800">Bulbasaur:</span> Baca situasi rakan Pokémon dengan teliti sebelum memilih objek kebersihan diri yang tepat.
                {situationsSolvedCount > 0 && (
                  <span className="font-bold ml-1 tabular-nums">
                    (Situasi selesai: {Math.max(situationsSolvedCount, progress.situationsCompleted ? 5 : 0)}/5)
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* BAHAGIAN B: JOM BINA AYAT BERSAMA PIKACHU */}
        {activeTab === 'B' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-amber-700 mb-1">
                  Aktiviti B · Jom Bina Ayat Bersama Pikachu
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  LENGKAPKAN AYAT MUDAH!
                </h2>
              </div>
              <div className="text-sm font-semibold text-slate-700 tabular-nums">
                Ayat dilengkapkan:{' '}
                <span className="font-bold text-amber-700">
                  {Object.keys(sentenceAnswers).length} / {PHASE4_SENTENCES.length}
                </span>
              </div>
            </div>

            <CharacterDialogue
              character="pikachu"
              message="Lengkapkan lima ayat mudah ini berdasarkan gambar yang diberi!"
            />

            <div className="space-y-4">
              {PHASE4_SENTENCES.map((sent) => {
                const selected = sentenceAnswers[sent.id];
                const isCorrect = sentencesSubmitted && selected === sent.correctWord;
                const isWrong = sentencesSubmitted && selected !== sent.correctWord;

                return (
                  <div
                    key={sent.id}
                    className={`rounded-2xl border p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4 bg-white ${
                      isCorrect
                        ? 'border-emerald-400 bg-emerald-50/40'
                        : isWrong
                          ? 'border-red-300 bg-red-50/40'
                          : 'border-slate-200'
                    }`}
                  >
                    <div className="w-24 aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                      <ResilientImage
                        src={sent.imageUrl}
                        alt={sent.imageAlt}
                        fallbackTitle="Gambar Ayat"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                        {sent.number}. {sent.beforeBlank}{' '}
                        <span className="inline-block min-w-[110px] px-3 py-0.5 mx-1 rounded-lg border border-dashed border-sky-400 bg-sky-50 text-sky-900 text-center">
                          {selected ? HYGIENE_WORD_MAP[selected].word.toLowerCase() : '______'}
                        </span>
                        {sent.afterBlank}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {HYGIENE_OBJECTS.map((opt) => {
                          const isPicked = selected === opt.key;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              disabled={sentencesSubmitted && isCorrect}
                              onClick={() => {
                                playClickPop();
                                setSentenceAnswers((prev) => ({ ...prev, [sent.id]: opt.key }));
                                setSentencesSubmitted(false);
                              }}
                              className={`px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[40px] ${
                                isPicked
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-white hover:border-sky-400'
                              }`}
                            >
                              {opt.word.toLowerCase()}
                            </button>
                          );
                        })}
                      </div>

                      {sentencesSubmitted && (
                        <p
                          className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                            isCorrect ? 'text-emerald-700' : 'text-red-600'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Betul! Ayat lengkap dan tepat.</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              <span>Cuba pilih perkataan yang sepadan dengan gambar.</span>
                            </>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSentenceAnswers({});
                  setSentencesSubmitted(false);
                  playClickPop();
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Cuba Semula</span>
              </button>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={!allSentencesFilled}
                  onClick={handleSubmitSentences}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-extrabold cursor-pointer min-h-[46px]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Semak Ayat</span>
                </button>

                {sentencesSubmitted && allSentencesCorrect && (
                  <button
                    type="button"
                    onClick={() => handleSelectPart('C')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold cursor-pointer min-h-[46px]"
                  >
                    <span>Ke Bahagian C: Laluan Latihan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BAHAGIAN C: LATIHAN MENGIKUT TAHAP PENGUASAAN */}
        {activeTab === 'C' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-red-700 mb-1">
                  Aktiviti C · Pemulihan &amp; Pengayaan
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  LATIHAN MENGIKUT TAHAP PENGUASAAN
                </h2>
              </div>
            </div>

            <CharacterDialogue
              character="pikachu"
              message="Pilih laluan latihan yang paling sesuai untuk kamu: Latihan Bimbingan atau Cabaran Lanjutan!"
            />

            {/* Pathway Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  setSelectedPath('bimbingan');
                }}
                className={`p-4 rounded-2xl border text-left transition-colors cursor-pointer ${
                  selectedPath === 'bimbingan'
                    ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-500'
                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-base font-extrabold text-slate-900">
                    Laluan 1: Latihan Bimbingan
                  </span>
                  {progress.remedialCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Gambar besar, audio sebutan, dua pilihan jawapan &amp; petunjuk Pikachu.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickPop();
                  setSelectedPath('lanjutan');
                }}
                className={`p-4 rounded-2xl border text-left transition-colors cursor-pointer ${
                  selectedPath === 'lanjutan'
                    ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-base font-extrabold text-slate-900">
                    Laluan 2: Cabaran Lanjutan
                  </span>
                  {progress.enrichmentCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Soalan kegunaan objek, situasi harian &amp; lengkapkan ayat konteks.
                </p>
              </button>
            </div>

            {selectedPath === 'bimbingan' ? (
              <div className="max-w-xl mx-auto rounded-3xl border border-sky-200 bg-sky-50/40 p-5 sm:p-7 space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-sky-800 tabular-nums">
                    Latihan Bimbingan · Item {remedialIdx + 1} / 5
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowRemedialClue((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-yellow-100 border border-yellow-300 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Petunjuk Pikachu</span>
                  </button>
                </div>

                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-white">
                  <ResilientImage
                    src={currentRemedialObj.imageUrl}
                    alt={currentRemedialObj.imageAlt}
                    fallbackTitle={currentRemedialObj.word}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => speakMalay(currentRemedialObj.word)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-sky-300 text-sky-800 text-sm font-bold cursor-pointer min-h-[44px]"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Dengar Sebutan ({currentRemedialObj.syllables})</span>
                  </button>
                </div>

                {showRemedialClue && (
                  <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-3.5 text-sm text-slate-800">
                    <span className="font-bold">Petunjuk Pikachu:</span> {currentRemedialObj.usageDescription}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {remedialChoices.map((choice) => {
                    const isPicked = remedialPicked === choice.key;
                    const isRight = isPicked && choice.key === currentRemedialObj.key;
                    const isWrong = isPicked && choice.key !== currentRemedialObj.key;

                    return (
                      <button
                        key={choice.key}
                        type="button"
                        onClick={() => {
                          setRemedialPicked(choice.key);
                          if (choice.key === currentRemedialObj.key) {
                            playSuccessChime();
                            if (remedialIdx === HYGIENE_OBJECTS.length - 1) {
                              onCompletePath('bimbingan');
                            }
                          } else {
                            playTryAgainTone();
                          }
                        }}
                        className={`px-4 py-4 rounded-2xl border font-display text-lg font-extrabold cursor-pointer min-h-[56px] ${
                          isRight
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : isWrong
                              ? 'bg-red-50 border-red-400 text-red-900'
                              : 'bg-white border-slate-300 hover:border-sky-500 text-slate-900'
                        }`}
                      >
                        {choice.word}
                      </button>
                    );
                  })}
                </div>

                {remedialPicked === currentRemedialObj.key && (
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-sm font-bold text-emerald-700">
                      Bagus! Jawapan kamu betul!
                    </span>
                    {remedialIdx + 1 < HYGIENE_OBJECTS.length ? (
                      <button
                        type="button"
                        onClick={() => {
                          setRemedialIdx((i) => i + 1);
                          setRemedialPicked(null);
                          setShowRemedialClue(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold cursor-pointer min-h-[40px]"
                      >
                        <span>Seterusnya</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                        <Sparkles className="w-4 h-4" />
                        <span>Latihan Bimbingan Selesai!</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {ENRICHMENT_CHALLENGES.map((item, idx) => {
                  const picked = enrichmentAnswers[idx];
                  const isRight = enrichmentSubmitted && picked === item.correct;
                  const isWrong = enrichmentSubmitted && picked !== item.correct;

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border p-5 space-y-3 bg-white ${
                        isRight
                          ? 'border-emerald-400 bg-emerald-50/40'
                          : isWrong
                            ? 'border-red-300 bg-red-50/40'
                            : 'border-slate-200'
                      }`}
                    >
                      <p className="font-display text-base sm:text-lg font-bold text-slate-900">
                        {idx + 1}. {item.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {item.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              playClickPop();
                              setEnrichmentAnswers((prev) => ({ ...prev, [idx]: opt }));
                              setEnrichmentSubmitted(false);
                            }}
                            className={`px-4 py-3 rounded-xl border text-sm font-semibold cursor-pointer min-h-[46px] ${
                              picked === opt
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={Object.keys(enrichmentAnswers).length < ENRICHMENT_CHALLENGES.length}
                    onClick={() => {
                      setEnrichmentSubmitted(true);
                      const allRight = ENRICHMENT_CHALLENGES.every(
                        (q, idx) => enrichmentAnswers[idx] === q.correct
                      );
                      if (allRight) {
                        onCompletePath('lanjutan');
                        playVictoryFanfare();
                      } else {
                        playTryAgainTone();
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white text-sm font-extrabold cursor-pointer min-h-[46px]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Semak Cabaran Lanjutan</span>
                  </button>

                  {enrichmentSubmitted && (
                    <p className="text-sm font-bold text-slate-800">
                      {ENRICHMENT_CHALLENGES.every((q, idx) => enrichmentAnswers[idx] === q.correct)
                        ? 'Cemerlang! Semua jawapan cabaran lanjutan betul!'
                        : 'Cuba semak semula situasi yang kurang tepat.'}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 flex items-center gap-3.5">
              <CharacterAvatar character="charmander" size="sm" />
              <p className="text-sm text-slate-800">
                <span className="font-bold text-amber-800">Charmander:</span> Teruskan usaha hebat kamu! Kamu juga boleh mencuba kedua-dua laluan untuk memantapkan bacaan.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Phase 4 Bottom Navigation (matches Misi 1) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackPhase3}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold cursor-pointer min-h-[46px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <UltraBallIcon className="w-4 h-4" />
          <span>Kembali ke Misi 3</span>
        </button>

        <button
          type="button"
          onClick={onNextPhase5}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-extrabold transition-colors cursor-pointer min-h-[46px]"
        >
          <EeveeIcon className="w-5 h-5" />
          <span>Seterusnya: Misi 5 (Tamatkan Pengembaraan)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
