import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retryWhen, delay, take, throwError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Ensure the service is provided in the root injector
})
export class QuestionService {
  private baseUrl = '/api/api.php'; // Use the proxy prefix

  constructor(private http: HttpClient) {}

  fetchQuestions(amount: number = 10): Observable<any> {
    const apiUrl = `${this.baseUrl}?amount=${amount}`;
    console.log('Fetching questions from API:', apiUrl); // Debugging log
    return this.http.get(apiUrl).pipe(
      map((response: any) => {
        console.log('API response:', response); // Debugging log
        return response.results.map((q: any) => ({
          question: this.decodeHtmlEntities(q.question),
          correct: this.decodeHtmlEntities(q.correct_answer),
          answers: this.shuffle([
            ...q.incorrect_answers.map((a: string) => this.decodeHtmlEntities(a)),
            this.decodeHtmlEntities(q.correct_answer)
          ]),
        }));
      }),
      catchError((error) => {
        console.error('Error in fetchQuestions:', error); // Debugging log
        return throwError(() => error);
      })
    );
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

const sampleResponse = {
  "results": [
    {
      "question": "What is the capital of France?",
      "incorrect_answers": ["London", "Berlin", "Madrid"],
      "correct_answer": "Paris"
    }
  ]
};
