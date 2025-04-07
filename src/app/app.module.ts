import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { FirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    HttpClientModule,
    FirestoreModule,
    AppComponent,
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
  ],
  // Removed bootstrap array as AppComponent is a standalone component
})
export class AppModule { }
