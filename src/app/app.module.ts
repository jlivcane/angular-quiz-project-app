import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component'; // Import the standalone component
import { MatCardModule } from '@angular/material/card'; // Added Angular Material modules
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    BrowserModule, 
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class AppModule {}
