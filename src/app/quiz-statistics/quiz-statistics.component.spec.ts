import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizStatisticsComponent } from './quiz-statistics.component';
import { FirebaseService } from '../services/firebase.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('QuizStatisticsComponent', () => {
  let component: QuizStatisticsComponent;
  let fixture: ComponentFixture<QuizStatisticsComponent>;
  let mockFirebaseService: jest.Mocked<FirebaseService>;
  let mockStore: jest.Mocked<Store>;

  beforeEach(async () => {
    mockFirebaseService = {
      getAllResults: jest.fn(),
    } as unknown as jest.Mocked<FirebaseService>;

    mockStore = {
      select: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<Store>;

    await TestBed.configureTestingModule({
      imports: [QuizStatisticsComponent],
      providers: [
        { provide: FirebaseService, useValue: mockFirebaseService },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch statistics on initialization', () => {
    const mockResults = [
      { totalQuestions: 10, correctAnswers: 8, timestamp: new Date() },
      { totalQuestions: 15, correctAnswers: 12, timestamp: new Date() },
    ];
    mockFirebaseService.getAllResults.mockResolvedValue(mockResults);

    component.ngOnInit();

    expect(mockFirebaseService.getAllResults).toHaveBeenCalled();
    setTimeout(() => {
      expect(component.quizAttempts).toEqual(mockResults);
      expect(component.totalQuizzes).toBe(mockResults.length);
      expect(component.highestScore).toBe(12);
      expect(component.averageScore).toBe(10);
    }, 0);
  });

  it('should navigate back to results', () => {
    const mockRouter = { navigate: jest.fn() } as any;
    component['router'] = mockRouter;

    component.goBackToResults();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/results']);
  });
});
