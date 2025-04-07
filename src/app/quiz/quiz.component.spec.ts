import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import { QuestionService } from '../services/question.service';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;
  let questionService: jest.Mocked<QuestionService>;
  let router: jest.Mocked<Router>;
  let store: jest.Mocked<Store>;

  beforeEach(async () => {
    // Mock dependencies
    const mockQuestionService = {
      fetchQuestions: jest.fn(),
      fetchCategories: jest.fn(),
      getQuestions: jest.fn(),
      getCategories: jest.fn(),
      apiUrl: '',
      categoriesUrl: '',
      http: {} // Provide a mock object for HttpClient if necessary
    } as unknown as jest.Mocked<QuestionService>;

    const mockRouter = {
      navigate: jest.fn(),
      getCurrentNavigation: jest.fn().mockReturnValue({
        extras: { state: { selectedCategory: 9, selectedDifficulty: 'medium' } }
      })
    } as unknown as jest.Mocked<Router>;

    const mockStore = {
      dispatch: jest.fn()
    } as unknown as jest.Mocked<Store>;

    await TestBed.configureTestingModule({
      imports: [QuizComponent, MatCardModule, MatButtonModule, MatProgressBarModule], // Add QuizComponent to imports
      providers: [
        { provide: QuestionService, useValue: mockQuestionService },
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
    questionService = TestBed.inject(QuestionService) as jest.Mocked<QuestionService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    store = TestBed.inject(Store) as jest.Mocked<Store>;
  });

  it('should create the QuizComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch questions on initialization', () => {
    const mockQuestions = {
      results: [
        {
          question: 'What is 2 + 2?',
          correct_answer: '4',
          incorrect_answers: ['3', '5', '6']
        }
      ]
    };
    questionService.fetchQuestions.mockReturnValue(of(mockQuestions));

    component.ngOnInit();

    expect(questionService.fetchQuestions).toHaveBeenCalledWith(10, 'medium', 9);
    expect(component.questions.length).toBe(1);
    expect(component.questions[0].question).toBe('What is 2 + 2?');
  });

  it('should increment score for correct answer', () => {
    component.questions = [
      { question: 'What is 2 + 2?', correct: '4', answers: ['3', '4', '5'] }
    ];
    component.currentQuestion = component.questions[0];

    component.selectAnswer('4');

    expect(component.score).toBe(1);
    expect(component.answeredQuestions[0].isCorrect).toBe(true);
  });

  it('should not increment score for incorrect answer', () => {
    component.questions = [
      { question: 'What is 2 + 2?', correct: '4', answers: ['3', '4', '5'] }
    ];
    component.currentQuestion = component.questions[0];

    component.selectAnswer('3');

    expect(component.score).toBe(0);
    expect(component.answeredQuestions[0].isCorrect).toBe(false);
  });

  it('should navigate to results page after quiz ends', () => {
    component.questions = [
      { question: 'What is 2 + 2?', correct: '4', answers: ['3', '4', '5'] }
    ];
    component.currentQuestionIndex = 1; // Simulate end of quiz

    component.endQuiz();

    expect(store.dispatch).toHaveBeenCalledWith({
      type: '[Quiz] Add Attempt',
      score: 0,
      totalQuestions: 10,
      correctAnswers: 0
    });
    expect(router.navigate).toHaveBeenCalledWith(['/results'], {
      state: { score: 0, answeredQuestions: [] }
    });
  });

  it('should handle timer expiration and move to the next question', () => {
    jest.useFakeTimers();
    component.questions = [
      { question: 'What is 2 + 2?', correct: '4', answers: ['3', '4', '5'] }
    ];
    component.currentQuestion = component.questions[0];

    component.startTimer();
    jest.advanceTimersByTime(30000); // Simulate 30 seconds

    expect(component.currentQuestionIndex).toBe(1);
    jest.useRealTimers();
  });
});
