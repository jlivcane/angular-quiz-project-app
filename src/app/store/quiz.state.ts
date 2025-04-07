export interface QuizState {
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  attempts: any[]; // Replace `any` with the appropriate type for attempts
}
