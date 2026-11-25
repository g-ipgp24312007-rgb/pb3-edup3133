import { useRef, useState } from 'react';
import { AdventureMap, PhaseStepperBar } from './components/AdventureMap';
import { FormativeAssessment } from './components/FormativeAssessment';
import { Header } from './components/Header';
import { HeroHome } from './components/HeroHome';
import { MissionHub } from './components/MissionHub';
import { Phase1Completion } from './components/Phase1Completion';
import { Phase2Hub } from './components/phase2/Phase2Hub';
import { Phase3Hub } from './components/phase3/Phase3Hub';
import { Phase4Hub } from './components/phase4/Phase4Hub';
import { Phase5Hub } from './components/phase5/Phase5Hub';
import { TeacherGuide } from './components/TeacherGuide';
import { PICTURE_CARDS } from './data/phase1Data';
import { useOpdProgress } from './hooks/useOpdProgress';
import { AppSection, MissionId, PhaseNumber } from './types/learning';
import { PotionIcon } from './components/PokemonIcons';
import { playClickPop, playVictoryFanfare, startPokemonTheme, stopSpeaking } from './utils/audio';

const SECTION_TO_PHASE: Partial<Record<AppSection, PhaseNumber>> = {
  mission: 1,
  phase2: 2,
  phase3: 3,
  phase4: 4,
  phase5: 5,
};

const PHASE_TO_SECTION: Record<PhaseNumber, AppSection> = {
  1: 'mission',
  2: 'phase2',
  3: 'phase3',
  4: 'phase4',
  5: 'phase5',
};

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('home');
  const [activeMission, setActiveMission] = useState<MissionId>('A');
  const themeAutoStartedRef = useRef(false);

  const {
    state,
    phase1CompletedCount,
    allPhase1MissionsCompleted,
    phasesStatusMap,
    completedPhasesCount,
    markPictureExplored,
    completeMissionA,
    setQuizAnswer,
    submitQuiz,
    retryQuiz,
    toggleFormativeCheck,
    finalizePhase1,
    markPhase2IntroWord,
    setPhase2VideoUrl,
    markPhase2Checkpoint,
    markPhase2ExploreObject,
    incrementPhase2Chat,
    completePhase3WordMatch,
    recordPhase3CatchScore,
    setPhase3AssessmentAnswer,
    submitPhase3Assessment,
    resetPhase3Assessment,
    completePhase4Situations,
    completePhase4Sentences,
    completePhase4Path,
    setPhase5FinalAnswer,
    submitPhase5Final,
    retryPhase5Final,
    setPhase5Reflection,
    markPhase5SummaryReviewed,
    generatePhase5Certificate,
    collectMapPokeball,
    resetAllProgress,
  } = useOpdProgress();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (section: AppSection) => {
    playClickPop();
    setActiveSection(section);
    scrollToTop();
  };

  const handleSelectPhase = (phase: PhaseNumber) => {
    playClickPop();
    setActiveSection(PHASE_TO_SECTION[phase]);
    scrollToTop();
  };

  const handleStartAdventure = () => {
    playClickPop();
    if (!themeAutoStartedRef.current) {
      themeAutoStartedRef.current = true;
      startPokemonTheme();
    }
    if (phasesStatusMap[1] !== 'Selesai') {
      if (!state.phase1.missionACompleted) {
        setActiveMission('A');
      } else {
        setActiveMission('C');
      }
      setActiveSection('mission');
    } else if (phasesStatusMap[2] !== 'Selesai') {
      setActiveSection('phase2');
    } else if (phasesStatusMap[3] !== 'Selesai') {
      setActiveSection('phase3');
    } else if (phasesStatusMap[4] !== 'Selesai') {
      setActiveSection('phase4');
    } else {
      setActiveSection('phase5');
    }
    scrollToTop();
  };

  const handleJumpToPhase1Mission = (mission: MissionId) => {
    playClickPop();
    setActiveMission(mission);
    setActiveSection('mission');
    scrollToTop();
  };

  const handleFinalizePhase1 = () => {
    finalizePhase1();
    playVictoryFanfare();
  };

  const handleResetSession = () => {
    stopSpeaking();
    playClickPop();
    resetAllProgress();
    setActiveMission('A');
    setActiveSection('home');
    scrollToTop();
  };

  const currentPhaseNumber = SECTION_TO_PHASE[activeSection];

  return (
    <div className="relative min-h-screen flex flex-col meadow-backdrop text-slate-900 overflow-x-hidden">
      {/* Scenic Vibrant Pokémon Adventure World Backdrop */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden no-print"
        aria-hidden="true"
      >
        <img
          src="/src/assets/images/bg_pokemon_adventure_world_1795578874966.jpg"
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300/15 via-white/15 to-emerald-200/25" />
        {/* Soft sunlit vignette glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-yellow-300/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-300/25 blur-3xl" />

        {/* Subtle drifting clouds & decorative Pokémon-world silhouettes along outer margins */}
        <svg
          viewBox="0 0 220 90"
          className="hidden lg:block absolute top-14 left-6 w-48 text-white/65 animate-cloud-drift"
          fill="currentColor"
        >
          <path d="M45 72H175C192 72 204 60 204 45C204 31 193 20 179 19C174 8 162 2 148 2C132 2 119 11 114 24C108 21 101 19 93 19C75 19 60 32 58 49C55 48 51 47 47 47C33 47 22 57 22 69C22 70 22 71 23 72H45Z" />
        </svg>
        <svg
          viewBox="0 0 220 90"
          className="hidden lg:block absolute top-24 right-8 w-40 text-white/60 animate-cloud-drift-reverse"
          fill="currentColor"
        >
          <path d="M45 72H175C192 72 204 60 204 45C204 31 193 20 179 19C174 8 162 2 148 2C132 2 119 11 114 24C108 21 101 19 93 19C75 19 60 32 58 49C55 48 51 47 47 47C33 47 22 57 22 69C22 70 22 71 23 72H45Z" />
        </svg>
        <svg
          viewBox="0 0 120 120"
          className="hidden xl:block absolute bottom-10 left-8 w-24 h-24 text-white/35 animate-gentle-float"
          fill="none"
        >
          <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="6" />
          <line x1="14" y1="60" x2="106" y2="60" stroke="currentColor" strokeWidth="6" />
          <circle cx="60" cy="60" r="14" stroke="currentColor" strokeWidth="6" />
        </svg>
        <svg
          viewBox="0 0 120 120"
          className="hidden xl:block absolute bottom-14 right-10 w-20 h-20 text-yellow-200/45 animate-star-twinkle"
          fill="currentColor"
        >
          <path d="M60 8L71 42L106 53L71 64L60 98L49 64L14 53L49 42L60 8Z" />
        </svg>
      </div>

      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        completedPhasesCount={completedPhasesCount}
        onResetProgress={handleResetSession}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {currentPhaseNumber && (
          <PhaseStepperBar
            currentPhase={currentPhaseNumber}
            phasesStatusMap={phasesStatusMap}
            onSelectPhase={handleSelectPhase}
          />
        )}

        {activeSection === 'home' && (
          <HeroHome
            progress={state.phase1}
            phasesStatusMap={phasesStatusMap}
            onStartAdventure={handleStartAdventure}
            onJumpToMission={handleJumpToPhase1Mission}
            onSelectPhase={handleSelectPhase}
            onOpenMap={() => handleNavigate('map')}
            onOpenAssessment={() => handleNavigate('assessment')}
            onResetProgress={handleResetSession}
          />
        )}

        {activeSection === 'map' && (
          <AdventureMap
            phasesStatusMap={phasesStatusMap}
            completedPhasesCount={completedPhasesCount}
            foundMapPokeballs={state.foundMapPokeballs}
            onCollectMapPokeball={collectMapPokeball}
            onSelectPhase={handleSelectPhase}
            onBackHome={() => handleNavigate('home')}
            onResetProgress={handleResetSession}
          />
        )}

        {activeSection === 'mission' && (
          <MissionHub
            activeMission={activeMission}
            onSelectMission={(m) => {
              playClickPop();
              setActiveMission(m);
              scrollToTop();
            }}
            progress={state.phase1}
            completedCount={phase1CompletedCount}
            allMissionsCompleted={allPhase1MissionsCompleted}
            onExplorePicture={(id) => markPictureExplored(id, PICTURE_CARDS.length)}
            onCompleteMissionA={completeMissionA}
            onSelectQuizAnswer={setQuizAnswer}
            onSubmitQuiz={submitQuiz}
            onRetryQuiz={retryQuiz}
            onOpenCompletion={() => handleNavigate('completion')}
            onNextPhase2={() => handleSelectPhase(2)}
          />
        )}

        {activeSection === 'phase2' && (
          <Phase2Hub
            progress={state.phase2}
            onMarkIntroWord={markPhase2IntroWord}
            onSaveVideoUrl={setPhase2VideoUrl}
            onMarkCheckpoint={markPhase2Checkpoint}
            onMarkExploreObject={markPhase2ExploreObject}
            onChatInteraction={incrementPhase2Chat}
            onBackPhase1={() => handleSelectPhase(1)}
            onNextPhase3={() => handleSelectPhase(3)}
          />
        )}

        {activeSection === 'phase3' && (
          <Phase3Hub
            progress={state.phase3}
            onCompleteWordMatch={completePhase3WordMatch}
            onRecordCatchScore={recordPhase3CatchScore}
            onSelectAssessmentAnswer={setPhase3AssessmentAnswer}
            onSubmitAssessment={submitPhase3Assessment}
            onResetAssessment={resetPhase3Assessment}
            onBackPhase2={() => handleSelectPhase(2)}
            onNextPhase4={() => handleSelectPhase(4)}
          />
        )}

        {activeSection === 'phase4' && (
          <Phase4Hub
            progress={state.phase4}
            onCompleteSituations={completePhase4Situations}
            onCompleteSentences={completePhase4Sentences}
            onCompletePath={completePhase4Path}
            onBackPhase3={() => handleSelectPhase(3)}
            onNextPhase5={() => handleSelectPhase(5)}
          />
        )}

        {activeSection === 'phase5' && (
          <Phase5Hub
            progress={state.phase5}
            phasesStatusMap={phasesStatusMap}
            onSelectPhase={handleSelectPhase}
            onSelectFinalAnswer={setPhase5FinalAnswer}
            onSubmitFinalChallenge={submitPhase5Final}
            onRetryFinalChallenge={retryPhase5Final}
            onSaveReflection={setPhase5Reflection}
            onMarkSummaryReviewed={markPhase5SummaryReviewed}
            onGenerateCertificate={generatePhase5Certificate}
            onBackPhase4={() => handleSelectPhase(4)}
            onBackHome={() => handleNavigate('home')}
          />
        )}

        {activeSection === 'assessment' && (
          <FormativeAssessment
            checkedMethodIds={state.phase1.formativeCheckedIds}
            onToggleChecked={toggleFormativeCheck}
            onGoToMission={() => handleNavigate('mission')}
          />
        )}

        {activeSection === 'teacher-guide' && (
          <TeacherGuide
            onGoToMission={() => handleNavigate('mission')}
            onGoToAssessment={() => handleNavigate('assessment')}
          />
        )}

        {activeSection === 'completion' && (
          <Phase1Completion
            progress={state.phase1}
            allMissionsCompleted={allPhase1MissionsCompleted}
            onGoToMission={handleJumpToPhase1Mission}
            onReviewActivities={() => handleJumpToPhase1Mission('A')}
            onBackHome={() => handleNavigate('home')}
            onFinalizePhase1={handleFinalizePhase1}
            onResetProgress={handleResetSession}
            onNextPhase2={() => handleSelectPhase(2)}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white/95 backdrop-blur-xs mt-auto no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>
            Misi Kebersihan Pokémon · Bahasa Melayu Tahun 2 · Misi 1 hingga Misi 5
          </p>
          <button
            type="button"
            onClick={handleResetSession}
            className="inline-flex items-center gap-1.5 font-semibold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <PotionIcon className="w-4 h-4" />
            <span>Set Semula Semua Kemajuan</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
