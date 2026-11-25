import React from 'react';
import { ArrowRight, Eye, HelpCircle } from 'lucide-react';
import { MissionId, Phase1ProgressState } from '../types/learning';
import { ActivityObservationQuiz } from './ActivityObservationQuiz';
import { ActivityPictureExplore } from './ActivityPictureExplore';
import { PhaseMissionHubHeader, PhasePartConfig } from './PhaseMissionHubHeader';
import { GreatBallIcon } from './PokemonIcons';

interface MissionHubProps {
  activeMission: MissionId;
  onSelectMission: (mission: MissionId) => void;
  progress: Phase1ProgressState;
  completedCount: number;
  allMissionsCompleted: boolean;
  onExplorePicture: (pictureId: string) => void;
  onCompleteMissionA: () => void;
  onSelectQuizAnswer: (questionId: string, optionKey: 'A' | 'B' | 'C') => void;
  onSubmitQuiz: (allCorrect: boolean) => void;
  onRetryQuiz: (keepCorrectAnswers?: Record<string, 'A' | 'B' | 'C'>) => void;
  onOpenCompletion: () => void;
  onNextPhase2: () => void;
}

type Phase1Part = 'A' | 'B';

export const MissionHub: React.FC<MissionHubProps> = ({
  activeMission,
  onSelectMission,
  progress,
  allMissionsCompleted,
  onExplorePicture,
  onCompleteMissionA,
  onSelectQuizAnswer,
  onSubmitQuiz,
  onRetryQuiz,
  onOpenCompletion,
  onNextPhase2,
}) => {
  const activePart: Phase1Part = activeMission === 'C' ? 'B' : 'A';

  const handleSelectPart = (part: Phase1Part) => {
    onSelectMission(part === 'A' ? 'A' : 'C');
  };

  const partsConfig: PhasePartConfig<Phase1Part>[] = [
    {
      id: 'A',
      code: 'Bahagian A',
      title: 'Teroka Gambar',
      subtitle: '4 kad gambar amalan kebersihan',
      icon: <Eye className="w-5 h-5 text-sky-600" />,
      completed: progress.missionACompleted,
    },
    {
      id: 'B',
      code: 'Bahagian B',
      title: 'Uji Pemerhatian',
      subtitle: '3 soalan kefahaman awal',
      icon: <HelpCircle className="w-5 h-5 text-emerald-600" />,
      completed: progress.missionCCompleted,
    },
  ];

  return (
    <div className="space-y-8 pb-14">
      {/* Misi 1 Header & Progress Tracker (2 Bahagian) */}
      <PhaseMissionHubHeader
        phaseEyebrow="RPH · Pengenalan Pembelajaran"
        missionTitle="MISI 1: SET INDUKSI"
        progressLabel="Kemajuan Misi 1"
        parts={partsConfig}
        activePart={activePart}
        onSelectPart={handleSelectPart}
        allCompletedAction={
          allMissionsCompleted
            ? {
                label: 'Tuntut Lencana',
                onClick: onOpenCompletion,
              }
            : undefined
        }
      />

      {/* Active Activity Canvas */}
      <section className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-5 sm:p-8 shadow-sm">
        {activePart === 'A' && (
          <ActivityPictureExplore
            exploredPictureIds={progress.exploredPictureIds}
            missionCompleted={progress.missionACompleted}
            onExplorePicture={onExplorePicture}
            onCompleteMission={onCompleteMissionA}
            onNextMission={() => handleSelectPart('B')}
          />
        )}

        {activePart === 'B' && (
          <ActivityObservationQuiz
            quizAnswers={progress.quizAnswers}
            quizSubmitted={progress.quizSubmitted}
            missionCompleted={progress.missionCCompleted}
            allMissionsCompleted={allMissionsCompleted}
            onSelectAnswer={onSelectQuizAnswer}
            onSubmitQuiz={onSubmitQuiz}
            onRetryQuiz={onRetryQuiz}
            onOpenCompletion={onOpenCompletion}
          />
        )}
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNextPhase2}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-extrabold transition-colors cursor-pointer min-h-[46px]"
        >
          <GreatBallIcon className="w-4 h-4" />
          <span>Seterusnya: Misi 2 (Langkah 1)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
