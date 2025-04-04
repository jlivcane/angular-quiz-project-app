import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, MatCardModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedCategory!: number;
  selectedDifficulty!: string;
  categories: any[] = [];
  difficulties: string[] = ['easy', 'medium', 'hard'];
  errorMessage: string = '';

  constructor(private questionService: QuestionService, private router: Router) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories(): void {
    this.questionService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.errorMessage = 'Failed to load categories.';
      }
    );
  }

  startQuiz(): void {
    if (!this.selectedCategory || !this.selectedDifficulty) {
      this.errorMessage = 'Please select a category and difficulty.';
      return;
    }
    // Navigate and pass the selected options if needed.
    this.router.navigate(['/quiz'], { state: {
      selectedCategory: this.selectedCategory,
      selectedDifficulty: this.selectedDifficulty
    }});
  }
}
