import { Component, OnInit, Inject } from '@angular/core'; // Added Inject
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; // Ensure this import is correct and matches the library
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ResultsService } from '../services/results.service';

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
  results: { totalQuestions: number; correctAnswers: number }[] = [];

  constructor(private router: Router, private resultsService: ResultsService) {
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
    this.resultsService.getResults().subscribe({
      next: (results) => {
        this.results = results;
        console.log('Results:', results);
      },
      error: (err) => {
        console.error('Error fetching results:', err);
      }
    });
  }

  restartQuiz(): void {
    this.router.navigate(['/']);
  }
}