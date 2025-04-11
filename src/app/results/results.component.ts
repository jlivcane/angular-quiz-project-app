import { Component, OnInit } from '@angular/core'; 
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { QuizState } from '../state/quiz.state';
import { Router } from '@angular/router';
import { ResultsService } from '../services/results.service';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  answeredQuestions: { question: string; userAnswer: string | null; correctAnswer: string; isCorrect: boolean }[] = [];
  score: number | null = null;
  results: { totalQuestions: number; correctAnswers: number; timestamp: Date }[] = [];
  attempts$!: Observable<QuizState['attempts']>; // Define attempts$ with proper type

  constructor(
    private router: Router,
    private resultsService: ResultsService,
    private store: Store<{ quiz: QuizState }>,
    private firebaseService: FirebaseService // Inject FirebaseService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras.state?.['answeredQuestions'];
    if (stateData && Array.isArray(stateData)) {
      this.answeredQuestions = stateData;
      this.score = this.answeredQuestions.filter(q => q.isCorrect).length; // Calculate score
    } else {
      console.error('No answered questions data found in navigation state.');
    }
    this.attempts$ = this.store.select((state) => state.quiz.attempts);
  }

  ngOnInit(): void {
    this.store.select((state) => state.quiz).subscribe((quizState) => {
      console.log('QuizState:', quizState); // Debugging log
      if (quizState.currentSession) {
        const { totalQuestions, answeredQuestions } = quizState.currentSession;
        const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length; // Calculate correct answers
        this.firebaseService.saveResult({ totalQuestions, correctAnswers, timestamp: new Date() })
          .catch((error) => console.error('Error saving result to Firebase:', error));
      }
    });

    this.attempts$ = this.store.select((state) => state.quiz.attempts); // Observe attempts
  }

  restartQuiz(): void {
    this.router.navigate(['/']);
  }

  viewStatistics(): void {
    this.router.navigate(['/quiz-statistics']); // Ensure correct route path
  }
}