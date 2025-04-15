import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { QuestionService } from '../services/question.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockQuestionService: jest.Mocked<QuestionService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockQuestionService = {
      fetchCategories: jest.fn(),
    } as unknown as jest.Mocked<QuestionService>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: QuestionService, useValue: mockQuestionService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on initialization', () => {
    const mockCategories = { trivia_categories: [{ id: 1, name: 'General Knowledge' }] };
    mockQuestionService.fetchCategories.mockReturnValue(of(mockCategories));

    component.ngOnInit();

    expect(mockQuestionService.fetchCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories.trivia_categories);
  });

  it('should handle error when loading categories fails', () => {
    mockQuestionService.fetchCategories.mockReturnValue(throwError(() => new Error('Failed to load categories')));

    component.ngOnInit();

    expect(mockQuestionService.fetchCategories).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Failed to load categories. Please try again later.');
  });

  it('should navigate to quiz with selected options when startQuiz is called', () => {
    component.selectedCategory = 1;
    component.selectedDifficulty = 'easy';

    component.startQuiz();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/quiz'], {
      state: { selectedCategory: 1, selectedDifficulty: 'easy' },
    });
  });

  
});
