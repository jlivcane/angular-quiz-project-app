import { createReducer, on } from '@ngrx/store';
import { QuizState, initialQuizState } from './quiz.state';
import { startQuiz, answerQuestion, endQuiz, addAttempt } from './quiz.actions';

export const quizReducer = createReducer(
  initialQuizState,
  on(startQuiz, (state, { totalQuestions }) => ({
    ...state,
    currentSession: {
      score: 0,
      totalQuestions,
      answeredQuestions: [],
    },
  })),
  on(answerQuestion, (state, { question, userAnswer, correctAnswer, isCorrect }) => ({
    ...state,
    currentSession: state.currentSession
      ? {
          ...state.currentSession,
          answeredQuestions: [
            ...state.currentSession.answeredQuestions,
            { question, userAnswer, correctAnswer, isCorrect },
          ],
          score: isCorrect ? state.currentSession.score + 1 : state.currentSession.score,
        }
      : null,
  })),
  on(endQuiz, (state) => ({
    ...state,
    currentSession: null,
  })),
  on(addAttempt, (state, { score, totalQuestions, correctAnswers }) => ({
    ...state,
    attempts: [
      ...state.attempts,
      { totalQuestions, correctAnswers, timestamp: new Date() },
    ],
  }))
);