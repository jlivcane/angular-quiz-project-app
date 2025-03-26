import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // Ensure this is correctly placed
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