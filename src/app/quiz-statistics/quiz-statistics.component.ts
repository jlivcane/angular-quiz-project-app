import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { QuizState } from '../state/quiz.state';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

interface QuizAttempt {
  totalQuestions: number;
  correctAnswers: number;
  timestamp: Date;
}

@Component({
  selector: 'app-quiz-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule
  ],
  templateUrl: './quiz-statistics.component.html',
  styleUrls: ['./quiz-statistics.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuizStatisticsComponent implements OnInit {
  columns = ['date', 'score', 'details']; // Define table columns
  players: string[] = []; // Remove player-specific logic
  selectedPlayer = ''; // Remove selectedPlayer logic
  totalQuizzes = 0;
  averageScore = 0;
  highestScore = 0;
  winLossRatio = '0:0';
  quizAttempts: QuizAttempt[] = []; // Use the defined interface
  performanceData: any[] = [];
  colorScheme = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'] };
  noResultsMessage = '';
  errorMessage = '';

  constructor(
    private store: Store<{ quiz: QuizState }>,
    private router: Router,
    private firebaseService: FirebaseService // Inject FirebaseService
  ) {}

  ngOnInit(): void {
    if (!this.firebaseService.isAuthenticated()) {
      console.warn('User not authenticated. Redirecting to login...');
      this.router.navigate(['/login']);
      return;
    }
    this.fetchStatistics(); // Fetch statistics for all players
  }

  fetchStatistics(): void {
    const userEmail = this.firebaseService.getCurrentUserEmail();
    if (!userEmail) {
      console.error('No user email found. Cannot fetch statistics.');
      this.errorMessage = 'User email is not available. Please log in again.';
      alert('An error occurred. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }

    this.firebaseService.getPlayerResults(userEmail)
      .then((results) => {
        console.log('Fetched results for authenticated user:', results); // Debugging log
        if (results.length === 0) {
          console.warn('No results found for the authenticated user.');
          this.noResultsMessage = 'No quiz statistics available.';
          this.quizAttempts = [];
          return;
        }
        this.quizAttempts = results.map((r) => ({
          timestamp: r.timestamp,
          totalQuestions: r.totalQuestions,
          correctAnswers: r.correctAnswers,
        }));
      })
      .catch((error) => {
        if (error.code === 'permission-denied') {
          console.error('Permission denied while fetching statistics:', error);
          this.errorMessage = 'You do not have permission to access this data.';
          alert('Permission denied. Please contact support if you believe this is an error.');
        } else {
          console.error('Error fetching statistics for authenticated user:', error);
          this.errorMessage = 'Failed to load quiz statistics.';
          alert('An error occurred while fetching statistics. Please try again later.');
        }
      });
  }

  viewDetails(attempt: any): void {
    console.log('Viewing details for:', attempt);
  }

  goBackToResults(): void {
    this.router.navigate(['/results']); // Adjust the route as needed
  }
}
