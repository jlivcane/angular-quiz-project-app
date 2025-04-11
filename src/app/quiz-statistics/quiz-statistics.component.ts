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
  players = ['Player 1', 'Player 2', 'Player 3'];
  selectedPlayer = this.players[0];
  totalQuizzes = 0;
  averageScore = 0;
  highestScore = 0;
  winLossRatio = '0:0';
  quizAttempts: { totalQuestions: number; correctAnswers: number; timestamp: Date }[] = [];
  performanceData: any[] = [];
  colorScheme = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'] };

  constructor(
    private store: Store<{ quiz: QuizState }>,
    private router: Router,
    private firebaseService: FirebaseService // Inject FirebaseService
  ) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics(): void {
    this.firebaseService.getAllResults()
      .then((results) => {
        console.log('Fetched results:', results); // Debugging log
        this.quizAttempts = results;
        this.totalQuizzes = results.length;
        this.highestScore = Math.max(...results.map((r) => r.correctAnswers), 0);
        this.averageScore = results.length
          ? results.reduce((sum, r) => sum + r.correctAnswers, 0) / results.length
          : 0;
        const wins = results.filter((r) => r.correctAnswers > 50).length;
        const losses = results.length - wins;
        this.winLossRatio = `${wins}:${losses}`;
        this.performanceData = results.map((r) => ({
          name: r.timestamp.toDateString(),
          value: r.correctAnswers,
        }));
      })
      .catch((error) => {
        if (error.message.includes('User is not authenticated')) {
          console.error('Authentication error:', error.message);
          alert('You must be logged in to view statistics. Please log in and try again.');
          this.router.navigate(['/login']); // Redirect to login page
        } else {
          console.error('Error fetching statistics from Firebase:', error);
          alert('An error occurred while fetching statistics. Please try again later.');
        }
      });
  }

  onPlayerChange(event: any): void {
    console.log('Player changed:', this.selectedPlayer);
    this.fetchStatistics();
  }

  viewDetails(attempt: any): void {
    console.log('Viewing details for:', attempt);
  }

  goBackToResults(): void {
    this.router.navigate(['/results']); // Adjust the route as needed
  }
}
