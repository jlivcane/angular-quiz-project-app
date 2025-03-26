import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResultsComponent } from './results/results.component'; // Import the ResultsComponent
import { HomeComponent } from './home/home.component'; // Import HomeComponent
import { QuizComponent } from './quiz/quiz.component'; // Import QuizComponent

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'quiz', component: QuizComponent },
      { path: 'results', component: ResultsComponent },
      { path: '**', redirectTo: '' } // Catch-all route
    ]) // Inline routes array here
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
