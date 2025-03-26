import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retryWhen, delay, take, throwError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private baseUrl = '/api/api.php'; // Use the proxy prefix

  constructor(private http: HttpClient) {}

  fetchQuestions(amount: number = 10): Observable<any> {
    const apiUrl = `${this.baseUrl}?amount=${amount}`;
    return this.http.get(apiUrl);
  }

  private decodeHtmlEntities(text: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }
}
