import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Attempt {
  totalQuestions: number;
  correctAnswers: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  private attemptsSubject = new BehaviorSubject<Attempt[]>([]);
  attempts$ = this.attemptsSubject.asObservable();

  addAttempt(totalQuestions: number, correctAnswers: number): void {
    const newAttempt: Attempt = {
      totalQuestions,
      correctAnswers,
      timestamp: new Date(),
    };
    const currentAttempts = this.attemptsSubject.value;
    this.attemptsSubject.next([...currentAttempts, newAttempt]);
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

  getResults(): Observable<Attempt[]> {
    return this.attempts$;
  }
}
