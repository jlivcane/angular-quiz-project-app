import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Import HomeComponent
import { QuizComponent } from './quiz/quiz.component';
import { QuizStatisticsComponent } from './quiz-statistics/quiz-statistics.component';
import { ResultsComponent } from './results/results.component';
import { LoginComponent } from './auth/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login
  { path: 'home', component: HomeComponent }, // Add route for HomeComponent
  { path: 'quiz', component: QuizComponent },
  { path: 'quiz-statistics', component: QuizStatisticsComponent }, // Ensure this route exists
  { path: 'results', component: ResultsComponent },
  { path: 'login', component: LoginComponent }
];
