import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from '../services/question.service';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { addAttempt } from '../state/quiz.actions';
import { ResultsService } from '../services/results.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    CommonModule,
    RouterModule // Ensure RouterModule is imported
  ],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {
  questions: { question: string; answers: string[]; correct: string }[] = [];
  currentQuestionIndex = 0;
  currentQuestion: { question: string; answers: string[]; correct: string } | null = null;
  timeLimit = 30;
  timeLeft = this.timeLimit;
  loading = true;
  timerSubscription: Subscription | null = null;
  score = 0;
  selectedAnswer: string | null = null;
  answered = false;
  answeredQuestions: { question: string; userAnswer: string | null; correctAnswer: string; isCorrect: boolean }[] = [];
  errorMessage: string | null = null;
  totalQuestions = 10;
  correctAnswers = 0;

  constructor(private questionService: QuestionService, @Inject(Router) private router: Router, @Inject(Store) private store: Store, private resultsService: ResultsService) {}

  ngOnInit(): void {
    console.log('QuizComponent initialized'); // Debugging log

    this.questionService.fetchQuestions(10).subscribe({
      next: (response) => {
        console.log('Fetched questions:', response); // Debugging log
        this.questions = response;
        this.setCurrentQuestion();
        this.loading = false; // Ensure loading is set to false
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error fetching questions:', error); // Debugging log
        this.loading = false; // Ensure loading is set to false even on error
        this.errorMessage = 'Failed to load questions. Please try again later.';
      },
      complete: () => {
        console.log('Question fetching completed.'); // Debugging log
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

    // Add the current attempt to the ResultsService
    this.resultsService.addAttempt(this.totalQuestions, this.score);

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

  ngOnDestroy(): void {
    this.clearTimer();
  }

  clearTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }
}
