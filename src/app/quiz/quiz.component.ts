import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { QuestionService } from '../services/question.service';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { QuizState } from '../state/quiz.state';
import { addAttempt } from '../state/quiz.actions';

interface QuizNavigationState {
  selectedCategory: number;
  selectedDifficulty: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MatProgressBarModule,
    MatCardModule
  ],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {
  questions: any[] = [];
  currentQuestion: any | null = null;
  subscription: Subscription | null = null;
  loading = false;
  errorMessage: string | null = null;
  categories: { id: number; name: string }[] = [];
  selectedCategory!: number;
  selectedDifficulty!: string;
  difficulties = ['easy', 'medium', 'hard'];
  currentQuestionIndex = 0;
  timeLimit = 30;
  timeLeft = this.timeLimit;
  timerSubscription: Subscription | null = null;
  score = 0;
  selectedAnswer: string | null = null;
  answered = false;
  answeredQuestions: {
    question: string;
    userAnswer: string | null;
    correctAnswer: string;
    isCorrect: boolean;
  }[] = [];
  totalQuestions = 10;
  correctAnswers = 0;

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private store: Store<{ quiz: QuizState }>
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as (QuizNavigationState | undefined);
    // Use bracket notation and provide fallback defaults if navigation state is missing.
    if (state && state['selectedCategory'] && state['selectedDifficulty']) {
      this.selectedCategory = state['selectedCategory'];
      this.selectedDifficulty = state['selectedDifficulty'];
    } else {
      console.warn('Navigation state missing; using defaults.');
      this.selectedCategory = 9; // e.g., General Knowledge
      this.selectedDifficulty = 'medium';
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.questionService
      .fetchQuestions(10, this.selectedDifficulty, this.selectedCategory)
      .subscribe({
        next: (response) => {
          console.log('API Response:', response);
          // Map the results to decode HTML entities and create an answers array
          this.questions = response.results.map((q: any) => {
            const decodedQuestion = this.decodeHTMLEntities(q.question);
            const decodedCorrect = this.decodeHTMLEntities(q.correct_answer);
            const decodedIncorrects = q.incorrect_answers.map((ans: string) =>
              this.decodeHTMLEntities(ans)
            );
            const answers = this.shuffle([decodedCorrect, ...decodedIncorrects]);
            return { ...q, question: decodedQuestion, correct: decodedCorrect, answers };
          });
          this.loading = false;
          this.setCurrentQuestion();
        },
        error: (error) => {
          console.error('Error fetching questions:', error);
          this.errorMessage = 'Failed to load questions. Please try again later.';
          this.loading = false;
        }
      });
  }

  setCurrentQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.startTimer();
    } else {
      this.endQuiz();
    }
  }

  startTimer(): void {
    this.timeLeft = this.timeLimit;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubscription = interval(1000)
      .pipe(take(this.timeLimit))
      .subscribe({
        next: () => {
          this.timeLeft--;
          if (this.timeLeft === 0) {
            this.moveToNextQuestion();
          }
        },
        complete: () => {
          console.log('Timer completed');
        }
      });
  }

  moveToNextQuestion(): void {
    this.currentQuestionIndex++;
    this.selectedAnswer = null;
    this.answered = false;
    if (this.currentQuestionIndex < this.questions.length) {
      this.setCurrentQuestion();
    } else {
      this.endQuiz();
    }
  }

  selectAnswer(answer: string): void {
    if (this.answered) return;
    this.selectedAnswer = answer;
    this.answered = true;
    this.clearTimer();

    if (this.currentQuestion) {
      const isCorrect = answer === this.currentQuestion.correct;
      this.answeredQuestions.push({
        question: this.currentQuestion.question,
        userAnswer: answer,
        correctAnswer: this.currentQuestion.correct,
        isCorrect,
      });
      if (isCorrect) {
        this.score++;
        this.correctAnswers++;
      }
    }

    setTimeout(() => {
      this.moveToNextQuestion();
    }, 2000);
  }

  endQuiz(): void {
    this.clearTimer();
    console.log('Quiz ended. Final score:', this.score);
    this.store.dispatch(
      addAttempt({
        score: this.score,
        totalQuestions: this.totalQuestions,
        correctAnswers: this.correctAnswers,
      })
    );
    this.router.navigate(['/results'], {
      state: {
        score: this.score,
        answeredQuestions: this.answeredQuestions
      }
    });
  }

  shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  clearTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  startQuiz(): void {
    console.log('startQuiz() called');
    // Additional logic to start the quiz if applicable.
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.subscription?.unsubscribe();
  }

  private decodeHTMLEntities(text: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }
}
