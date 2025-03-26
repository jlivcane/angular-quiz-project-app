import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';
import { ResultsComponent } from './results/results.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'quiz', component: QuizComponent }, // Ensure this route exists
  { path: 'results', component: ResultsComponent },
  { path: '**', redirectTo: '' }, // Catch-all route
];
