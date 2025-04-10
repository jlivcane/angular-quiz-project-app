import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { incrementScore, nextQuestion, resetQuiz } from '../store/quizSlice';

const QuizComponent: React.FC = () => {
	const dispatch = useDispatch();
	const { score, currentQuestionIndex } = useSelector((state: RootState) => state.quiz);

	return (
		<div>
			<h1>Quiz</h1>
			<p>Score: {score}</p>
			<p>Current Question: {currentQuestionIndex}</p>
			<button onClick={() => dispatch(incrementScore())}>Increment Score</button>
			<button onClick={() => dispatch(nextQuestion())}>Next Question</button>
			<button onClick={() => dispatch(resetQuiz())}>Reset Quiz</button>
		</div>
	);
};

export default QuizComponent;
