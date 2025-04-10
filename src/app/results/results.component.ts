import { Component, OnInit, Inject } from '@angular/core'; 
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; 
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ResultsService } from '../services/results.service';
import { Store } from '@ngrx/store';
import { QuizState } from '../state/quiz.state';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatTableModule, CommonModule, RouterModule],
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
    private store: Store<{ quiz: QuizState }> // Ensure Store is injected here
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
    });

    this.attempts$ = this.store.select((state) => state.quiz.attempts); // Observe attempts
  }

  restartQuiz(): void {
    this.router.navigate(['/']);
  }
}