export interface QuizState {
  attempts: {
    score: number;
    totalQuestions: number;
    timestamp: Date;
  }[];
  currentSession: {
    score: number;
    totalQuestions: number;
    answeredQuestions: {
      question: string;
      userAnswer: string | null;
      correctAnswer: string;
      isCorrect: boolean;
    }[];
  } | null;
}

export const initialQuizState: QuizState = {
  attempts: [],
  currentSession: null,
};