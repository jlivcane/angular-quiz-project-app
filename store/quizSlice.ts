import { createSlice } from '@reduxjs/toolkit';

interface QuizState {
	score: number;
	currentQuestionIndex: number;
}

const initialState: QuizState = {
	score: 0,
	currentQuestionIndex: 0,
};

const quizSlice = createSlice({
	name: 'quiz',
	initialState,
	reducers: {
		incrementScore(state) {
			state.score += 1;
		},
		nextQuestion(state) {
			state.currentQuestionIndex += 1;
		},
		resetQuiz(state) {
			state.score = 0;
			state.currentQuestionIndex = 0;
		},
	},
});

export const { incrementScore, nextQuestion, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
