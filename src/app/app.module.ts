import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatTabsModule } from '@angular/material/tabs'; // Import MatTabsModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes'; // Import the routes

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes), // Use routes directly
    NgxChartsModule,
    MatTabsModule // Add MatTabsModule here
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
