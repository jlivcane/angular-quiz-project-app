import { Component, OnInit, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedCategory!: number;
  selectedDifficulty!: string;
  categories: any[] = [];
  difficulties: string[] = ['easy', 'medium', 'hard'];
  errorMessage: string = '';

  constructor(
    private questionService: QuestionService,
    @Inject(Router) private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories(); // Ensure categories are loaded
  }

  loadCategories(): void {
    this.questionService.fetchCategories().subscribe({
      next: (response) => {
        this.categories = response.trivia_categories || [];
        console.log('Categories loaded:', this.categories); // Debugging log
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories. Please try again later.';
      }
    });
  }

  startQuiz(): void {
    console.log('Quiz is starting with category:', this.selectedCategory, 'and difficulty:', this.selectedDifficulty);
    console.log('Difficulties:', this.difficulties); // Debugging log

    if (!this.selectedCategory || !this.selectedDifficulty) {
      this.errorMessage = 'Please select a category and difficulty.';
      console.warn('Start Quiz failed: Category or Difficulty not selected.');
      return;
    }

    console.log('Starting quiz with:', {
      category: this.selectedCategory,
      difficulty: this.selectedDifficulty
    });

    // Navigate and pass the selected options if needed.
    this.router.navigate(['/quiz'], {
      state: {
        selectedCategory: this.selectedCategory,
        selectedDifficulty: this.selectedDifficulty
      }
    });
  }
}
