export interface QuizState {
  attempts: {
    totalQuestions: number;
    correctAnswers: number;
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
  attempts: [], // Initialize as an empty array
  currentSession: null,
};