import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TriviaService {
  private API_URL = 'https://opentdb.com/api.php?amount=10';

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<any> {
    return this.http.get(this.API_URL);
  }
}