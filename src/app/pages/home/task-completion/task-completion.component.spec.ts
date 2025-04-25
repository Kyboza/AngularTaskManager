import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCompletionComponent } from './task-completion.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
//klar
describe('TaskCompletionComponent', () => {
  let component: TaskCompletionComponent;
  let fixture: ComponentFixture<TaskCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCompletionComponent, MatProgressBarModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct percentage of tasks completed', () => {
    component.percentCompleted = 50;
    fixture.detectChanges();
    const percentageText = fixture.debugElement.query(By.css('.percentage__container p')).nativeElement;
    expect(percentageText.textContent).toContain('50');
  });

  it('should correctly bind the progress bar value to percentCompleted', () => {
    component.percentCompleted = 75; 
    fixture.detectChanges(); 
  
  
    const progressBar = fixture.debugElement.query(By.css('mat-progress-bar')).nativeElement;
    expect(progressBar.getAttribute('aria-valuenow')).toBe('75');
  });

  it('should show 0% by default if percentCompleted is not provided', () => {
    const defaultText = fixture.debugElement.query(By.css('.percentage__container p')).nativeElement;
    expect(defaultText.textContent).toContain('0');
  });

  it('should show 100% if percentCompleted is set to 100', () => {
    component.percentCompleted = 100;
    fixture.detectChanges();
    const percentageText = fixture.debugElement.query(By.css('.percentage__container p')).nativeElement;
    expect(percentageText.textContent).toContain('100');
  });
});
