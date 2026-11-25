export type AppSection =
  | 'home'
  | 'map'
  | 'mission'
  | 'phase2'
  | 'phase3'
  | 'phase4'
  | 'phase5'
  | 'assessment'
  | 'teacher-guide'
  | 'completion';

export type PhaseNumber = 1 | 2 | 3 | 4 | 5;

export type MissionStatus = 'Belum bermula' | 'Sedang berlangsung' | 'Selesai';

export type MissionId = 'A' | 'B' | 'C';

export type HygieneWordKey = 'sabun' | 'berus-gigi' | 'tuala' | 'syampu' | 'sikat';

export type PokemonCharacterId = 'pikachu' | 'squirtle' | 'bulbasaur' | 'charmander' | 'eevee';

export interface PictureCardItem {
  id: string;
  title: string;
  shortLabel: string;
  imageUrl: string;
  imageAlt: string;
  description: string;
  hygieneTip: string;
  companion: PokemonCharacterId;
}

export interface TargetWordItem {
  id: string;
  word: string;
  syllables: string;
  meaning: string;
  usageExample: string;
  accentColor: 'blue' | 'yellow' | 'green' | 'red';
}

export interface HygieneObjectItem {
  key: HygieneWordKey;
  word: string;
  syllables: string;
  imageUrl: string;
  imageAlt: string;
  usageDescription: string;
  exampleSentence: string;
  companion: PokemonCharacterId;
  companionGreeting: string;
}

export interface VideoStoryboardStep {
  step: number;
  text: string;
}

export interface QuizOption {
  key: 'A' | 'B' | 'C';
  text: string;
}

export interface QuizQuestionItem {
  id: string;
  number: number;
  question: string;
  options: QuizOption[];
  correctAnswer: 'A' | 'B' | 'C';
  explanation: string;
}

export interface VideoCheckpointQuestion {
  id: string;
  number: number;
  triggerPercent: number;
  question: string;
  options: string[];
  correctAnswer: string;
  feedbackCorrect: string;
  feedbackWrong: string;
}

export interface Phase3AssessmentQuestion {
  id: string;
  number: number;
  targetWord: HygieneWordKey;
  type: 'word-from-image' | 'image-from-word' | 'object-usage' | 'context-sentence';
  question: string;
  promptImageUrl?: string;
  promptImageAlt?: string;
  options: {
    key: 'A' | 'B' | 'C';
    label: string;
    imageUrl?: string;
    imageAlt?: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C';
}

export interface RoutineStepItem {
  id: string;
  correctOrder: number;
  wordKey: HygieneWordKey;
  title: string;
  imageUrl: string;
  imageAlt: string;
  explanation: string;
}

export interface SituationChoiceItem {
  id: string;
  character: PokemonCharacterId;
  situation: string;
  correctWord: HygieneWordKey;
  feedback: string;
}

export interface SentenceChallengeItem {
  id: string;
  number: number;
  beforeBlank: string;
  afterBlank: string;
  correctWord: HygieneWordKey;
  imageUrl: string;
  imageAlt: string;
}

export interface FormativeMethodItem {
  id: string;
  title: string;
  description: string;
  character: PokemonCharacterId;
  teacherAction: string;
}

export interface Phase1ProgressState {
  exploredPictureIds: string[];
  missionACompleted: boolean;
  missionBCompleted: boolean;
  missionCCompleted: boolean;
  learnedWordIds: string[];
  teacherVideoUrl: string;
  quizAnswers: Record<string, 'A' | 'B' | 'C'>;
  quizSubmitted: boolean;
  formativeCheckedIds: string[];
  phase1Finalized: boolean;
  phase1FinalizedAt: string | null;
}

export interface Phase2ProgressState {
  introWordsClicked: HygieneWordKey[];
  videoUrl: string;
  checkpointsAnswered: string[];
  exploreObjectsClicked: HygieneWordKey[];
  chatInteractions: number;
}

export interface Phase3ProgressState {
  wordMatchCompleted: boolean;
  catchBestScore: number;
  catchCompleted: boolean;
  assessmentAnswers: Record<string, 'A' | 'B' | 'C'>;
  assessmentSubmitted: boolean;
  assessmentScore: number;
  assessmentCompleted: boolean;
}

export interface Phase4ProgressState {
  routineCompleted: boolean;
  situationsCompleted: boolean;
  sentencesCompleted: boolean;
  remedialCompleted: boolean;
  enrichmentCompleted: boolean;
}

export interface Phase5ProgressState {
  finalAnswers: Record<string, 'A' | 'B' | 'C'>;
  finalSubmitted: boolean;
  finalScore: number;
  masteredWords: HygieneWordKey[];
  reviewWords: HygieneWordKey[];
  reflectionFeeling: string;
  reflectionEasiestWord: HygieneWordKey | '';
  summaryReviewed: boolean;
  studentName: string;
  certificateGenerated: boolean;
  completedAt: string | null;
}

export interface OpdFullProgressState {
  phase1: Phase1ProgressState;
  phase2: Phase2ProgressState;
  phase3: Phase3ProgressState;
  phase4: Phase4ProgressState;
  phase5: Phase5ProgressState;
  foundMapPokeballs: string[];
}

export interface PhaseDefinition {
  phaseNumber: PhaseNumber;
  missionTitle: string;
  title: string;
  subtitle: string;
  enabled: boolean;
}
