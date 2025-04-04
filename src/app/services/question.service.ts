import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'https://opentdb.com/api.php';
  private categoriesUrl = 'https://opentdb.com/api_category.php'; // Correct API endpoint

  constructor(private http: HttpClient) {}

  fetchQuestions(amount: number, difficulty?: string, category?: number): Observable<any> {
    let url = `${this.apiUrl}?amount=${amount}`;
    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }
    if (category) {
      url += `&category=${category}`;
    }
    return this.http.get<any>(url);
  }

  fetchCategories(): Observable<any> {
    const url = 'https://opentdb.com/api_category.php';
    return this.http.get<any>(url);
  }

  getQuestions(category: string, difficulty: string): Observable<any> {
    return this.http.get(`api/questions?category=${category}&difficulty=${difficulty}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any>(this.categoriesUrl).pipe(
      map(response => response.trivia_categories || [])
    );
  }
}
