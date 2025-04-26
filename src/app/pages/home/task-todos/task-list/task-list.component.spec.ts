import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Tasks } from '../../../../shared/models/tasks';
import { By } from '@angular/platform-browser';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  const mockTasks: Tasks[] = [
    new Tasks(1, 'Task 1', false,  false, 'Low', 1, undefined),
    new Tasks(2, 'Task 2', false,  true, 'Low', 1, undefined)
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TaskListComponent,
        MatProgressSpinnerModule,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should not show spinner when isLoading is false', () => {
    component.isLoading = false;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeNull();
  });

  it('should render task items when tasks are provided', () => {
    component.isLoading = false;
    component.myTasks = mockTasks;
    fixture.detectChanges();
    const taskItems = fixture.debugElement.queryAll(By.css('app-task-item'));
    expect(taskItems.length).toBe(2);
  });

  it('should emit toggled event when handleToggle is called', () => {
    spyOn(component.toggled, 'emit');
    const task = mockTasks[0];
    component.handleToggle(task);
    expect(component.toggled.emit).toHaveBeenCalledWith(task);
  });
});
