import { useCallback, useEffect, useState } from 'react';
import {
  HygieneWordKey,
  MissionStatus,
  OpdFullProgressState,
  Phase1ProgressState,
  PhaseNumber,
} from '../types/learning';

const STORAGE_KEY_V2 = 'pokemon_hygiene_adventure_opd_v2';
const LEGACY_PHASE1_KEY = 'pokemon_hygiene_adventure_phase1_v1';

const DEFAULT_PHASE1: Phase1ProgressState = {
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

const DEFAULT_OPD_PROGRESS: OpdFullProgressState = {
  phase1: DEFAULT_PHASE1,
  phase2: {
    introWordsClicked: [],
    videoUrl: '',
    checkpointsAnswered: [],
    exploreObjectsClicked: [],
    chatInteractions: 0,
  },
  phase3: {
    wordMatchCompleted: false,
    catchBestScore: 0,
    catchCompleted: false,
    assessmentAnswers: {},
    assessmentSubmitted: false,
    assessmentScore: 0,
    assessmentCompleted: false,
  },
  phase4: {
    routineCompleted: false,
    situationsCompleted: false,
    sentencesCompleted: false,
    remedialCompleted: false,
    enrichmentCompleted: false,
  },
  phase5: {
    finalAnswers: {},
    finalSubmitted: false,
    finalScore: 0,
    masteredWords: [],
    reviewWords: [],
    reflectionFeeling: '',
    reflectionEasiestWord: '',
    summaryReviewed: false,
    studentName: '',
    certificateGenerated: false,
    completedAt: null,
  },
  foundMapPokeballs: [],
};

function readInitialProgress(): OpdFullProgressState {
  if (typeof window === 'undefined') return DEFAULT_OPD_PROGRESS;
  try {
    const rawV2 = window.localStorage.getItem(STORAGE_KEY_V2);
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as Partial<OpdFullProgressState>;
      return {
        phase1: {
          ...DEFAULT_PHASE1,
          ...(parsed.phase1 || {}),
          exploredPictureIds: Array.isArray(parsed.phase1?.exploredPictureIds)
            ? parsed.phase1.exploredPictureIds
            : [],
          learnedWordIds: Array.isArray(parsed.phase1?.learnedWordIds)
            ? parsed.phase1.learnedWordIds
            : [],
          formativeCheckedIds: Array.isArray(parsed.phase1?.formativeCheckedIds)
            ? parsed.phase1.formativeCheckedIds
            : [],
          quizAnswers: parsed.phase1?.quizAnswers || {},
        },
        phase2: {
          ...DEFAULT_OPD_PROGRESS.phase2,
          ...(parsed.phase2 || {}),
          introWordsClicked: Array.isArray(parsed.phase2?.introWordsClicked)
            ? parsed.phase2.introWordsClicked
            : [],
          checkpointsAnswered: Array.isArray(parsed.phase2?.checkpointsAnswered)
            ? parsed.phase2.checkpointsAnswered
            : [],
          exploreObjectsClicked: Array.isArray(parsed.phase2?.exploreObjectsClicked)
            ? parsed.phase2.exploreObjectsClicked
            : [],
        },
        phase3: {
          ...DEFAULT_OPD_PROGRESS.phase3,
          ...(parsed.phase3 || {}),
          assessmentAnswers: parsed.phase3?.assessmentAnswers || {},
        },
        phase4: {
          ...DEFAULT_OPD_PROGRESS.phase4,
          ...(parsed.phase4 || {}),
        },
        phase5: {
          ...DEFAULT_OPD_PROGRESS.phase5,
          ...(parsed.phase5 || {}),
          finalAnswers: parsed.phase5?.finalAnswers || {},
          masteredWords: Array.isArray(parsed.phase5?.masteredWords)
            ? parsed.phase5.masteredWords
            : [],
          reviewWords: Array.isArray(parsed.phase5?.reviewWords)
            ? parsed.phase5.reviewWords
            : [],
        },
        foundMapPokeballs: Array.isArray(parsed.foundMapPokeballs)
          ? parsed.foundMapPokeballs
          : [],
      };
    }

    // Migrate existing Phase 1 progress seamlessly if present
    const legacyRaw = window.localStorage.getItem(LEGACY_PHASE1_KEY);
    if (legacyRaw) {
      const parsedLegacy = JSON.parse(legacyRaw) as Partial<Phase1ProgressState>;
      return {
        ...DEFAULT_OPD_PROGRESS,
        phase1: {
          ...DEFAULT_PHASE1,
          ...parsedLegacy,
          exploredPictureIds: Array.isArray(parsedLegacy.exploredPictureIds)
            ? parsedLegacy.exploredPictureIds
            : [],
          learnedWordIds: Array.isArray(parsedLegacy.learnedWordIds)
            ? parsedLegacy.learnedWordIds
            : [],
          formativeCheckedIds: Array.isArray(parsedLegacy.formativeCheckedIds)
            ? parsedLegacy.formativeCheckedIds
            : [],
          quizAnswers: parsedLegacy.quizAnswers || {},
        },
      };
    }

    return DEFAULT_OPD_PROGRESS;
  } catch {
    return DEFAULT_OPD_PROGRESS;
  }
}

export function useOpdProgress() {
  const [state, setState] = useState<OpdFullProgressState>(() => readInitialProgress());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(state));
      window.localStorage.setItem(LEGACY_PHASE1_KEY, JSON.stringify(state.phase1));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  // --- Phase 1 Actions (Preserved 100%) ---
  const markPictureExplored = useCallback((pictureId: string, totalPictures: number) => {
    setState((prev) => {
      const nextExplored = prev.phase1.exploredPictureIds.includes(pictureId)
        ? prev.phase1.exploredPictureIds
        : [...prev.phase1.exploredPictureIds, pictureId];
      const allExplored = nextExplored.length >= totalPictures;
      return {
        ...prev,
        phase1: {
          ...prev.phase1,
          exploredPictureIds: nextExplored,
          missionACompleted: prev.phase1.missionACompleted || allExplored,
        },
      };
    });
  }, []);

  const completeMissionA = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase1: { ...prev.phase1, missionACompleted: true },
    }));
  }, []);

  const markWordLearned = useCallback((wordId: string) => {
    setState((prev) => {
      if (prev.phase1.learnedWordIds.includes(wordId)) return prev;
      return {
        ...prev,
        phase1: {
          ...prev.phase1,
          learnedWordIds: [...prev.phase1.learnedWordIds, wordId],
        },
      };
    });
  }, []);

  const setTeacherVideoUrl = useCallback((url: string) => {
    setState((prev) => ({
      ...prev,
      phase1: { ...prev.phase1, teacherVideoUrl: url },
    }));
  }, []);

  const completeMissionB = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase1: { ...prev.phase1, missionBCompleted: true },
    }));
  }, []);

  const setQuizAnswer = useCallback((questionId: string, optionKey: 'A' | 'B' | 'C') => {
    setState((prev) => ({
      ...prev,
      phase1: {
        ...prev.phase1,
        quizAnswers: { ...prev.phase1.quizAnswers, [questionId]: optionKey },
      },
    }));
  }, []);

  const submitQuiz = useCallback((allCorrect: boolean) => {
    setState((prev) => ({
      ...prev,
      phase1: {
        ...prev.phase1,
        quizSubmitted: true,
        missionCCompleted: prev.phase1.missionCCompleted || allCorrect,
      },
    }));
  }, []);

  const retryQuiz = useCallback((keepCorrectAnswers?: Record<string, 'A' | 'B' | 'C'>) => {
    setState((prev) => ({
      ...prev,
      phase1: {
        ...prev.phase1,
        quizAnswers: keepCorrectAnswers ?? {},
        quizSubmitted: false,
      },
    }));
  }, []);

  const toggleFormativeCheck = useCallback((methodId: string) => {
    setState((prev) => {
      const exists = prev.phase1.formativeCheckedIds.includes(methodId);
      return {
        ...prev,
        phase1: {
          ...prev.phase1,
          formativeCheckedIds: exists
            ? prev.phase1.formativeCheckedIds.filter((id) => id !== methodId)
            : [...prev.phase1.formativeCheckedIds, methodId],
        },
      };
    });
  }, []);

  const finalizePhase1 = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase1: {
        ...prev.phase1,
        phase1Finalized: true,
        phase1FinalizedAt: new Date().toISOString(),
      },
    }));
  }, []);

  // --- Phase 2 Actions ---
  const markPhase2IntroWord = useCallback((wordKey: HygieneWordKey) => {
    setState((prev) => {
      if (prev.phase2.introWordsClicked.includes(wordKey)) return prev;
      return {
        ...prev,
        phase2: {
          ...prev.phase2,
          introWordsClicked: [...prev.phase2.introWordsClicked, wordKey],
        },
      };
    });
  }, []);

  const setPhase2VideoUrl = useCallback((url: string) => {
    setState((prev) => ({
      ...prev,
      phase2: { ...prev.phase2, videoUrl: url },
    }));
  }, []);

  const markPhase2Checkpoint = useCallback((checkpointId: string) => {
    setState((prev) => {
      if (prev.phase2.checkpointsAnswered.includes(checkpointId)) return prev;
      return {
        ...prev,
        phase2: {
          ...prev.phase2,
          checkpointsAnswered: [...prev.phase2.checkpointsAnswered, checkpointId],
        },
      };
    });
  }, []);

  const markPhase2ExploreObject = useCallback((wordKey: HygieneWordKey) => {
    setState((prev) => {
      if (prev.phase2.exploreObjectsClicked.includes(wordKey)) return prev;
      return {
        ...prev,
        phase2: {
          ...prev.phase2,
          exploreObjectsClicked: [...prev.phase2.exploreObjectsClicked, wordKey],
        },
      };
    });
  }, []);

  const incrementPhase2Chat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase2: {
        ...prev.phase2,
        chatInteractions: prev.phase2.chatInteractions + 1,
      },
    }));
  }, []);

  // --- Phase 3 Actions ---
  const completePhase3WordMatch = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase3: { ...prev.phase3, wordMatchCompleted: true },
    }));
  }, []);

  const recordPhase3CatchScore = useCallback((score: number) => {
    setState((prev) => ({
      ...prev,
      phase3: {
        ...prev.phase3,
        catchBestScore: Math.max(prev.phase3.catchBestScore, score),
        catchCompleted: true,
      },
    }));
  }, []);

  const setPhase3AssessmentAnswer = useCallback((qId: string, optionKey: 'A' | 'B' | 'C') => {
    setState((prev) => ({
      ...prev,
      phase3: {
        ...prev.phase3,
        assessmentAnswers: { ...prev.phase3.assessmentAnswers, [qId]: optionKey },
      },
    }));
  }, []);

  const submitPhase3Assessment = useCallback((score: number) => {
    setState((prev) => ({
      ...prev,
      phase3: {
        ...prev.phase3,
        assessmentSubmitted: true,
        assessmentScore: score,
        assessmentCompleted: true,
      },
    }));
  }, []);

  const resetPhase3Assessment = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase3: {
        ...prev.phase3,
        assessmentAnswers: {},
        assessmentSubmitted: false,
      },
    }));
  }, []);

  // --- Phase 4 Actions ---
  const completePhase4Routine = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase4: { ...prev.phase4, routineCompleted: true },
    }));
  }, []);

  const completePhase4Situations = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase4: { ...prev.phase4, situationsCompleted: true },
    }));
  }, []);

  const completePhase4Sentences = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase4: { ...prev.phase4, sentencesCompleted: true },
    }));
  }, []);

  const completePhase4Path = useCallback((path: 'bimbingan' | 'lanjutan') => {
    setState((prev) => ({
      ...prev,
      phase4: {
        ...prev.phase4,
        remedialCompleted: path === 'bimbingan' ? true : prev.phase4.remedialCompleted,
        enrichmentCompleted: path === 'lanjutan' ? true : prev.phase4.enrichmentCompleted,
      },
    }));
  }, []);

  // --- Phase 5 Actions ---
  const setPhase5FinalAnswer = useCallback((qId: string, optionKey: 'A' | 'B' | 'C') => {
    setState((prev) => ({
      ...prev,
      phase5: {
        ...prev.phase5,
        finalAnswers: { ...prev.phase5.finalAnswers, [qId]: optionKey },
      },
    }));
  }, []);

  const submitPhase5Final = useCallback(
    (score: number, masteredWords: HygieneWordKey[], reviewWords: HygieneWordKey[]) => {
      setState((prev) => ({
        ...prev,
        phase5: {
          ...prev.phase5,
          finalSubmitted: true,
          finalScore: score,
          masteredWords,
          reviewWords,
        },
      }));
    },
    []
  );

  const retryPhase5Final = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase5: {
        ...prev.phase5,
        finalAnswers: {},
        finalSubmitted: false,
      },
    }));
  }, []);

  const setPhase5Reflection = useCallback(
    (feeling: string, easiestWord: HygieneWordKey | '') => {
      setState((prev) => ({
        ...prev,
        phase5: {
          ...prev.phase5,
          reflectionFeeling: feeling,
          reflectionEasiestWord: easiestWord,
        },
      }));
    },
    []
  );

  const markPhase5SummaryReviewed = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase5: { ...prev.phase5, summaryReviewed: true },
    }));
  }, []);

  const generatePhase5Certificate = useCallback((studentName: string) => {
    setState((prev) => ({
      ...prev,
      phase5: {
        ...prev.phase5,
        studentName: studentName.trim(),
        certificateGenerated: true,
        completedAt: prev.phase5.completedAt || new Date().toISOString(),
      },
    }));
  }, []);

  const collectMapPokeball = useCallback((ballId: string) => {
    setState((prev) => {
      if (prev.foundMapPokeballs.includes(ballId)) return prev;
      return {
        ...prev,
        foundMapPokeballs: [...prev.foundMapPokeballs, ballId],
      };
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    setState(DEFAULT_OPD_PROGRESS);
    try {
      window.localStorage.removeItem(STORAGE_KEY_V2);
      window.localStorage.removeItem(LEGACY_PHASE1_KEY);
    } catch {
      // Ignore storage error
    }
  }, []);

  // --- Computed Statuses Across Phases 1-5 ---
  const phase1CompletedCount =
    (state.phase1.missionACompleted ? 1 : 0) +
    (state.phase1.missionCCompleted ? 1 : 0);
  const allPhase1MissionsCompleted = phase1CompletedCount === 2;

  const getPhaseStatus = (phase: PhaseNumber): MissionStatus => {
    if (phase === 1) {
      if (allPhase1MissionsCompleted) return 'Selesai';
      if (
        state.phase1.exploredPictureIds.length > 0 ||
        state.phase1.missionACompleted ||
        Object.keys(state.phase1.quizAnswers).length > 0
      ) {
        return 'Sedang berlangsung';
      }
      return 'Belum bermula';
    }

    if (phase === 2) {
      const done =
        state.phase2.introWordsClicked.length >= 5 &&
        state.phase2.exploreObjectsClicked.length >= 5 &&
        state.phase2.checkpointsAnswered.length >= 5;
      if (done) return 'Selesai';
      if (
        state.phase2.introWordsClicked.length > 0 ||
        state.phase2.checkpointsAnswered.length > 0 ||
        state.phase2.exploreObjectsClicked.length > 0 ||
        state.phase2.chatInteractions > 0
      ) {
        return 'Sedang berlangsung';
      }
      return 'Belum bermula';
    }

    if (phase === 3) {
      const done =
        state.phase3.wordMatchCompleted &&
        state.phase3.catchCompleted &&
        state.phase3.assessmentCompleted;
      if (done) return 'Selesai';
      if (
        state.phase3.wordMatchCompleted ||
        state.phase3.catchCompleted ||
        state.phase3.assessmentCompleted ||
        Object.keys(state.phase3.assessmentAnswers).length > 0
      ) {
        return 'Sedang berlangsung';
      }
      return 'Belum bermula';
    }

    if (phase === 4) {
      const done =
        state.phase4.situationsCompleted &&
        state.phase4.sentencesCompleted &&
        (state.phase4.remedialCompleted || state.phase4.enrichmentCompleted);
      if (done) return 'Selesai';
      if (
        state.phase4.situationsCompleted ||
        state.phase4.sentencesCompleted ||
        state.phase4.remedialCompleted ||
        state.phase4.enrichmentCompleted
      ) {
        return 'Sedang berlangsung';
      }
      return 'Belum bermula';
    }

    if (
      state.phase5.finalSubmitted &&
      state.phase5.summaryReviewed &&
      Boolean(state.phase5.reflectionFeeling && state.phase5.reflectionEasiestWord)
    ) {
      return 'Selesai';
    }
    if (
      state.phase5.finalSubmitted ||
      state.phase5.reflectionFeeling ||
      state.phase5.summaryReviewed ||
      state.phase5.certificateGenerated ||
      Object.keys(state.phase5.finalAnswers).length > 0
    ) {
      return 'Sedang berlangsung';
    }
    return 'Belum bermula';
  };

  const phasesStatusMap: Record<PhaseNumber, MissionStatus> = {
    1: getPhaseStatus(1),
    2: getPhaseStatus(2),
    3: getPhaseStatus(3),
    4: getPhaseStatus(4),
    5: getPhaseStatus(5),
  };

  const completedPhasesCount = ([1, 2, 3, 4, 5] as PhaseNumber[]).filter(
    (p) => phasesStatusMap[p] === 'Selesai'
  ).length;

  return {
    state,
    phase1CompletedCount,
    allPhase1MissionsCompleted,
    phasesStatusMap,
    completedPhasesCount,
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
    completePhase4Routine,
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
  };
}
