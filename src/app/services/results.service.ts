import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Attempt {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timestamp: Date;
}

interface Result {
  totalQuestions: number;
  correctAnswers: number;
}

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  private attemptsSubject = new BehaviorSubject<Attempt[]>([]);
  attempts$ = this.attemptsSubject.asObservable();

  private results: Result[] = [
    { totalQuestions: 10, correctAnswers: 8 },
    { totalQuestions: 15, correctAnswers: 12 },
    { totalQuestions: 20, correctAnswers: 18 },
  ];

  addAttempt(score: number, totalQuestions: number, correctAnswers: number): void {
    try {
      const currentAttempts = this.attemptsSubject.value;
      const newAttempt: Attempt = { score, totalQuestions, correctAnswers, timestamp: new Date() };
      this.attemptsSubject.next([...currentAttempts, newAttempt]);
    } catch (error) {
      console.error('Error adding attempt:', error);
    }
  }

  clearAttempts(): void {
    try {
      this.attemptsSubject.next([]);
    } catch (error) {
      console.error('Error clearing attempts:', error);
    }
  }

  getAttempts(): Observable<Attempt[]> {
    return of(this.attemptsSubject.value).pipe(
      catchError((error) => {
        console.error('Error fetching attempts:', error);
        return throwError(() => new Error('Failed to fetch attempts'));
      })
    );
  }

  getResults(): Observable<Result[]> {
    return of(this.results).pipe(
      catchError((error) => {
        console.error('Error fetching results:', error);
        return throwError(() => new Error('Failed to fetch results'));
      })
    );
  }
}
