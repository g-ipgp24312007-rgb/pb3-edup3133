import { useCallback, useEffect, useState } from 'react';
import { Phase1ProgressState } from '../types/learning';

const STORAGE_KEY = 'pokemon_hygiene_adventure_phase1_v1';

const DEFAULT_PROGRESS: Phase1ProgressState = {
  exploredPictureIds: [],
  missionACompleted: false,
  missionBCompleted: false,
  missionCCompleted: false,
  learnedWordIds: [],
  teacherVideoUrl: '',
  quizAnswers: {},
  quizSubmitted: false,
  formativeCheckedIds: [],
  phase1Finalized: false,
  phase1FinalizedAt: null,
};

function readStoredProgress(): Phase1ProgressState {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<Phase1ProgressState>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      exploredPictureIds: Array.isArray(parsed.exploredPictureIds) ? parsed.exploredPictureIds : [],
      learnedWordIds: Array.isArray(parsed.learnedWordIds) ? parsed.learnedWordIds : [],
      formativeCheckedIds: Array.isArray(parsed.formativeCheckedIds) ? parsed.formativeCheckedIds : [],
      quizAnswers: parsed.quizAnswers && typeof parsed.quizAnswers === 'object' ? parsed.quizAnswers : {},
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function usePhase1Progress() {
  const [progress, setProgress] = useState<Phase1ProgressState>(() => readStoredProgress());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [progress]);

  const markPictureExplored = useCallback((pictureId: string, totalPictures: number) => {
    setProgress((prev) => {
      const nextExplored = prev.exploredPictureIds.includes(pictureId)
        ? prev.exploredPictureIds
        : [...prev.exploredPictureIds, pictureId];
      const allExplored = nextExplored.length >= totalPictures;
      return {
        ...prev,
        exploredPictureIds: nextExplored,
        missionACompleted: prev.missionACompleted || allExplored,
      };
    });
  }, []);

  const completeMissionA = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      missionACompleted: true,
    }));
  }, []);

  const markWordLearned = useCallback((wordId: string) => {
    setProgress((prev) => {
      if (prev.learnedWordIds.includes(wordId)) return prev;
      return {
        ...prev,
        learnedWordIds: [...prev.learnedWordIds, wordId],
      };
    });
  }, []);

  const setTeacherVideoUrl = useCallback((url: string) => {
    setProgress((prev) => ({
      ...prev,
      teacherVideoUrl: url,
    }));
  }, []);

  const completeMissionB = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      missionBCompleted: true,
    }));
  }, []);

  const setQuizAnswer = useCallback((questionId: string, optionKey: 'A' | 'B' | 'C') => {
    setProgress((prev) => ({
      ...prev,
      quizAnswers: {
        ...prev.quizAnswers,
        [questionId]: optionKey,
      },
    }));
  }, []);

  const submitQuiz = useCallback((allCorrect: boolean) => {
    setProgress((prev) => ({
      ...prev,
      quizSubmitted: true,
      missionCCompleted: prev.missionCCompleted || allCorrect,
    }));
  }, []);

  const retryQuiz = useCallback((keepCorrectAnswers?: Record<string, 'A' | 'B' | 'C'>) => {
    setProgress((prev) => ({
      ...prev,
      quizAnswers: keepCorrectAnswers ?? {},
      quizSubmitted: false,
    }));
  }, []);

  const toggleFormativeCheck = useCallback((methodId: string) => {
    setProgress((prev) => {
      const exists = prev.formativeCheckedIds.includes(methodId);
      return {
        ...prev,
        formativeCheckedIds: exists
          ? prev.formativeCheckedIds.filter((id) => id !== methodId)
          : [...prev.formativeCheckedIds, methodId],
      };
    });
  }, []);

  const finalizePhase1 = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      phase1Finalized: true,
      phase1FinalizedAt: new Date().toISOString(),
    }));
  }, []);

  const resetPhase1Progress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
  }, []);

  const completedCount =
    (progress.missionACompleted ? 1 : 0) +
    (progress.missionBCompleted ? 1 : 0) +
    (progress.missionCCompleted ? 1 : 0);

  const allMissionsCompleted = completedCount === 3;

  return {
    progress,
    completedCount,
    allMissionsCompleted,
    markPictureExplored,
    completeMissionA,
    markWordLearned,
    setTeacherVideoUrl,
    completeMissionB,
    setQuizAnswer,
    submitQuiz,
    retryQuiz,
    toggleFormativeCheck,
    finalizePhase1,
    resetPhase1Progress,
  };
}
