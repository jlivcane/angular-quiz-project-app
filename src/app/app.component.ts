import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideRouter } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [],
  providers: [provideRouter([])],
  imports: [RouterModule],
  template: `
    <h1>{{ title }}</h1>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'Quiz App';

  constructor() {
    console.log('AppComponent initialized'); // Debugging log
  }
}