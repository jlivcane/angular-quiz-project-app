import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { quizReducer } from './app/state/quiz.reducer';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { FirestoreModule } from '@angular/fire/firestore';
import { environment } from './environments/environment';
import { FirebaseService } from './app/services/firebase.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideStore({ quiz: quizReducer }),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    FirestoreModule,
    FirebaseService
  ],
}).catch(err => console.error(err));