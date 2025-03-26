import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import { QuestionService } from '../services/question.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;
  let questionService: jasmine.SpyObj<QuestionService>;

  beforeEach(async () => {
    // Create a spy object for the QuestionService
    const spy = jasmine.createSpyObj('QuestionService', ['fetchQuestions']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatCardModule,
        MatButtonModule,
        MatProgressBarModule
      ],
      declarations: [QuizComponent],
      providers: [
        { provide: QuestionService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
    questionService = TestBed.inject(QuestionService) as jasmine.SpyObj<QuestionService>;
  });

  it('should create the QuizComponent', () => {
    expect(component).toBeTruthy(); // Test if the component is created
  });

  it('should populate the questions array after initialization', async () => {
    // Mock the service to return data
    const mockQuestions = [
      { question: 'What is 2 + 2?', answers: ['3', '4', '5'], correct: '4' }
    ];
    questionService.fetchQuestions.and.returnValue(of(mockQuestions));

    // Initialize component and check if the questions array is populated
    fixture.detectChanges(); // Trigger change detection
    expect(component.questions.length).toBeGreaterThan(0); // Ensure the questions array has data
    expect(component.currentQuestion).toEqual(mockQuestions[0]); // Ensure the current question is set
  });

  it('should initialize with questions', () => {
    const mockQuestions = [
      { question: 'What is 2 + 2?', answers: ['3', '4', '5'], correct: '4' }
    ];
    
    questionService.fetchQuestions.and.returnValue(of(mockQuestions)); // Mock the service method
    fixture.detectChanges(); // Trigger change detection to initialize the component
    
    expect(component.questions.length).toBeGreaterThan(0); // Ensure questions are loaded
    expect(component.currentQuestion).toEqual(mockQuestions[0]); // Check if the current question is correct
  });

  it('should increment score for correct answer', () => {
    const mockQuestions = [
      { question: 'What is 2 + 2?', answers: ['3', '4', '5'], correct: '4' }
    ];

    questionService.fetchQuestions.and.returnValue(of(mockQuestions));  // Mock the service method
    fixture.detectChanges(); // Trigger change detection

    // Select the correct answer
    component.selectAnswer('4'); // This should increment the score

    expect(component.score).toBe(1); // The score should increment to 1 for correct answer
  });

  it('should not increment score for incorrect answer', () => {
    const mockQuestions = [
      { question: 'What is 2 + 2?', answers: ['3', '4', '5'], correct: '4' }
    ];

    questionService.fetchQuestions.and.returnValue(of(mockQuestions));  // Mock the service method
    fixture.detectChanges(); // Trigger change detection

    // Select an incorrect answer
    component.selectAnswer('3');  // Incorrect answer

    expect(component.score).toBe(0); // The score should not change for incorrect answer
  });
});
