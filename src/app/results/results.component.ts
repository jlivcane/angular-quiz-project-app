import { Component, OnInit, Inject } from '@angular/core'; // Added Inject
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; // Ensure this import is correct and matches the library
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
  attempts$!: Observable<QuizState['attempts']>;

  constructor(private router: Router, private resultsService: ResultsService, @Inject(Store) private store: Store<{ quiz: QuizState }>) {
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras.state?.['answeredQuestions'];
    if (stateData && Array.isArray(stateData)) {
      this.answeredQuestions = stateData;
      this.score = this.answeredQuestions.filter(q => q.isCorrect).length; // Calculate score
    } else {
      console.error('No answered questions data found in navigation state.');
    }
  }

  ngOnInit(): void {
    // Fetch results from the ResultsService
    this.resultsService.getResults().subscribe({
      next: (results) => {
        this.results = results; // Bind results to the template
        console.log('Results:', results); // Debugging log
      },
      error: (err) => {
        console.error('Error fetching results:', err);
      }
    });

    // Fetch attempts from the store
    this.attempts$ = this.store.select((state) => state.quiz.attempts);
  }

  restartQuiz(): void {
    this.router.navigate(['/']);
  }
}