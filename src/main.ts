import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { quizReducer } from './app/state/quiz.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Moved here from AppComponent
    provideHttpClient(),
    provideStore({ quiz: quizReducer }),
  ],
}).catch((err) => console.error(err));