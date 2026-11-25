import React from 'react';
import { Award, CheckCircle2, RotateCcw, Send, XCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/phase1Data';
import { playClickPop, playSuccessChime, playTryAgainTone } from '../utils/audio';
import { CharacterDialogue } from './CharacterDialogue';
import { CharacterAvatar } from './PokemonIcons';

interface ActivityObservationQuizProps {
  quizAnswers: Record<string, 'A' | 'B' | 'C'>;
  quizSubmitted: boolean;
  missionCompleted: boolean;
  allMissionsCompleted: boolean;
  onSelectAnswer: (questionId: string, optionKey: 'A' | 'B' | 'C') => void;
  onSubmitQuiz: (allCorrect: boolean) => void;
  onRetryQuiz: (keepCorrectAnswers?: Record<string, 'A' | 'B' | 'C'>) => void;
  onOpenCompletion: () => void;
}

export const ActivityObservationQuiz: React.FC<ActivityObservationQuizProps> = ({
  quizAnswers,
  quizSubmitted,
  missionCompleted,
  allMissionsCompleted,
  onSelectAnswer,
  onSubmitQuiz,
  onRetryQuiz,
  onOpenCompletion,
}) => {
  const answeredCount = QUIZ_QUESTIONS.filter((q) => Boolean(quizAnswers[q.id])).length;
  const allAnswered = answeredCount === QUIZ_QUESTIONS.length;

  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => quizAnswers[q.id] === q.correctAnswer
  ).length;
  const allCorrect = correctCount === QUIZ_QUESTIONS.length;

  const handleChooseOption = (questionId: string, optionKey: 'A' | 'B' | 'C') => {
    if (quizSubmitted) return;
    playClickPop();
    onSelectAnswer(questionId, optionKey);
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    const passedAll = QUIZ_QUESTIONS.every((q) => quizAnswers[q.id] === q.correctAnswer);
    onSubmitQuiz(passedAll);
    if (passedAll) {
      playSuccessChime();
    } else {
      playTryAgainTone();
    }
  };

  const handleRetryWrongOrAll = () => {
    playClickPop();
    if (allCorrect) {
      onRetryQuiz({});
      return;
    }
    const kept: Record<string, 'A' | 'B' | 'C'> = {};
    QUIZ_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        kept[q.id] = q.correctAnswer;
      }
    });
    onRetryQuiz(kept);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-emerald-700 mb-1">Bahagian B · Uji Pemerhatian</p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            APA YANG KAMU PERHATIKAN?
          </h2>
        </div>
        <div className="text-sm font-semibold text-slate-700 tabular-nums">
          Soalan dijawab: <span className="font-bold text-emerald-700">{answeredCount} / {QUIZ_QUESTIONS.length}</span>
        </div>
      </div>

      <CharacterDialogue
        character="pikachu"
        message="Pelatih, sudahkah kamu meneroka keempat-empat gambar tadi? Mari kita uji pemerhatian kamu!"
      />

      {/* Bulbasaur Helper Notice */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center gap-3.5">
        <CharacterAvatar character="bulbasaur" size="sm" />
        <p className="text-sm text-slate-800">
          <span className="font-bold text-emerald-800">Bulbasaur:</span> Baca setiap soalan dengan teliti dan pilih satu jawapan yang betul sebelum menekan butang Hantar Jawapan.
        </p>
      </div>

      {/* 3 Observation Questions */}
      <div className="space-y-5">
        {QUIZ_QUESTIONS.map((q) => {
          const selected = quizAnswers[q.id];
          const isCorrect = quizSubmitted && selected === q.correctAnswer;
          const isWrong = quizSubmitted && selected !== q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`rounded-2xl border p-5 sm:p-6 bg-white transition-colors space-y-4 ${
                isCorrect
                  ? 'border-emerald-300'
                  : isWrong
                    ? 'border-red-300'
                    : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">
                  Soalan {q.number}: {q.question}
                </h3>
                {quizSubmitted && (
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold shrink-0 ${
                      isCorrect ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Betul</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Cuba Lagi</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2.5" role="radiogroup" aria-label={`Pilihan jawapan Soalan ${q.number}`}>
                {q.options.map((opt) => {
                  const isSelected = selected === opt.key;
                  let optionStyle =
                    'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-sky-400 text-slate-900';

                  if (isSelected && !quizSubmitted) {
                    optionStyle = 'border-sky-600 bg-sky-50 text-slate-900 ring-1 ring-sky-600';
                  } else if (quizSubmitted && isSelected && isCorrect) {
                    optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                  } else if (quizSubmitted && isSelected && isWrong) {
                    optionStyle = 'border-red-400 bg-red-50 text-red-950';
                  }

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={quizSubmitted}
                      onClick={() => handleChooseOption(q.id, opt.key)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all flex items-center gap-3.5 min-h-[52px] ${
                        quizSubmitted ? 'cursor-default' : 'cursor-pointer'
                      } ${optionStyle}`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold shrink-0 border ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base font-medium">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Per-question immediate feedback ONLY after submission */}
              {quizSubmitted && (
                <div
                  className={`rounded-xl p-3.5 text-sm font-medium ${
                    isCorrect
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border border-amber-200 text-amber-950'
                  }`}
                >
                  {isCorrect ? (
                    <div className="space-y-1">
                      <p className="font-bold">Pika Pika! Hebat Pelatih! Jawapan kamu betul!</p>
                      <p className="text-xs sm:text-sm text-emerald-800">{q.explanation}</p>
                    </div>
                  ) : (
                    <p className="font-bold">
                      Jangan putus asa, Pelatih! Cuba fikir sekali lagi.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons: HANTAR JAWAPAN / CUBA SEMULA */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-slate-700">
          {!quizSubmitted ? (
            <span>
              {allAnswered
                ? 'Semua soalan telah dipilih. Tekan Hantar Jawapan untuk semakan.'
                : 'Pilih jawapan bagi ketiga-tiga soalan di atas.'}
            </span>
          ) : (
            <span className="font-bold tabular-nums">
              Skor Pemerhatian: {correctCount} / {QUIZ_QUESTIONS.length} betul
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!quizSubmitted ? (
            <button
              type="button"
              disabled={!allAnswered}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-extrabold tracking-wide transition-colors cursor-pointer min-h-[48px] whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              <span>HANTAR JAWAPAN</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetryWrongOrAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold transition-colors cursor-pointer min-h-[44px] whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{allCorrect ? 'Jawab Semula' : 'Cuba Semula'}</span>
              </button>

              {allMissionsCompleted && (
                <button
                  type="button"
                  onClick={onOpenCompletion}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors cursor-pointer min-h-[44px] whitespace-nowrap"
                >
                  <Award className="w-4 h-4" />
                  <span>Lihat Skrin Kejayaan</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Overall Feedback Banner */}
      {quizSubmitted && !allCorrect && (
        <CharacterDialogue
          character="charmander"
          message="Jangan putus asa, Pelatih! Cuba fikir sekali lagi."
        />
      )}

      {(missionCompleted || (quizSubmitted && allCorrect)) && (
        <CharacterDialogue
          character="pikachu"
          message="Pika Pika! Hebat Pelatih! Jawapan kamu betul!"
        />
      )}
    </div>
  );
};
