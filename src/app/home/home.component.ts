import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html', 
  styleUrls: ['./home.component.css'],
  imports: [RouterModule] 
})
export class HomeComponent {
  title = 'Welcome to the Quiz!';

  constructor() {
    console.log('HomeComponent loaded'); 
  }
}
