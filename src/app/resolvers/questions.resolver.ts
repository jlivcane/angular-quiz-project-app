import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TriviaService } from '../services/trivia.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionsResolver implements Resolve<any> {
  constructor(private triviaService: TriviaService) {}

  resolve(): Observable<any> {
    return this.triviaService.getQuestions();
  }
}
