import { ResultsComponent } from './results.component';
import { Router } from '@angular/router';
import { ResultsService } from '../services/results.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { QuizState } from '../state/quiz.state';
import { TestBed } from '@angular/core/testing';

describe('ResultsComponent', () => {
  let component: ResultsComponent;

  beforeEach(() => {
    const mockRouter: Partial<Router> = {
      navigate: jest.fn(),
      getCurrentNavigation: jest.fn().mockReturnValue({
        extras: { state: { answeredQuestions: [{ isCorrect: true }, { isCorrect: false }] } }
      })
    };

    const mockResultsService: Partial<ResultsService> = {
      attempts$: of([]),
      addAttempt: jest.fn(),
      clearAttempts: jest.fn(),
    };

    const mockStore: Partial<Store<{ quiz: QuizState }>> = {
      select: jest.fn().mockReturnValue(of({ attempts: [] })),
    };

    TestBed.configureTestingModule({
      declarations: [ResultsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ResultsService, useValue: mockResultsService },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
