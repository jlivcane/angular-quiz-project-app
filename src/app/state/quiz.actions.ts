import { createAction, props } from '@ngrx/store';

export const startQuiz = createAction(
  '[Quiz] Start Quiz',
  props<{ totalQuestions: number }>()
);

export const answerQuestion = createAction(
  '[Quiz] Answer Question',
  props<{
    question: string;
    userAnswer: string | null;
    correctAnswer: string;
    isCorrect: boolean;
  }>()
);

export const endQuiz = createAction(
  '[Quiz] End Quiz',
  props<{ score: number }>()
);

export const resetStatistics = createAction('[Quiz] Reset Statistics');

export const addAttempt = createAction(
  '[Quiz] Add Attempt',
  props<{ score: number; totalQuestions: number; correctAnswers: number }>()
);

export const clearAttempts = createAction('[Quiz] Clear Attempts');