import { ResultsComponent } from './results.component';
import { Router } from '@angular/router';
import { ResultsService } from '../services/results.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { QuizState } from '../state/quiz.state';
import { TestBed, ComponentFixture } from '@angular/core/testing';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockResultsService: jest.Mocked<ResultsService>;
  let mockStore: jest.Mocked<Store<{ quiz: QuizState }>>;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn(),
      getCurrentNavigation: jest.fn().mockReturnValue({
        extras: { state: { answeredQuestions: [{ isCorrect: true }, { isCorrect: false }] } }
      }),
    } as unknown as jest.Mocked<Router>;

    mockResultsService = {
      attempts$: of([]),
      addAttempt: jest.fn(),
      clearAttempts: jest.fn(),
    } as unknown as jest.Mocked<ResultsService>;

    mockStore = {
      select: jest.fn().mockReturnValue(of({ attempts: [] })),
    } as unknown as jest.Mocked<Store<{ quiz: QuizState }>>;

    TestBed.configureTestingModule({
      declarations: [ResultsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ResultsService, useValue: mockResultsService },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate score from navigation state', () => {
    expect(component.score).toBe(1); // 1 correct answer from mock navigation state
  });

  it('should navigate to quiz-statistics when viewStatistics is called', () => {
    component.viewStatistics();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/quiz-statistics']);
  });

  it('should navigate to home when restartQuiz is called', () => {
    component.restartQuiz();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle store subscription for attempts', () => {
    const mockAttempts = [{ totalQuestions: 10, correctAnswers: 8, timestamp: new Date() }];
    mockStore.select.mockReturnValue(of({ attempts: mockAttempts }));

    component.ngOnInit();

    expect(mockStore.select).toHaveBeenCalledWith(expect.any(Function));
    expect(component.attempts$).toBeDefined();
  });

  it('should save results to Firebase on initialization', () => {
    const mockFirebaseService = {
      saveResult: jest.fn().mockResolvedValue(true),
    } as any;
    component['firebaseService'] = mockFirebaseService;

    component.ngOnInit();

    expect(mockFirebaseService.saveResult).toHaveBeenCalledWith(
      expect.objectContaining({ totalQuestions: 2, correctAnswers: 1 })
    );
  });
});
