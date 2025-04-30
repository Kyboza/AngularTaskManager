import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Tasks } from '../../../../shared/models/tasks';
import { By } from '@angular/platform-browser';
import { ProjectService } from '../../../../shared/services/projectId-service/project.service';
import { LaterTaskService } from '../../../../shared/services/later-task-service/later-task.service';
import { EventService } from '../../../../shared/services/event-service/event.service';
import { signal } from '@angular/core';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  // Mock dependencies
  let mockProjectService: Partial<ProjectService>;
  let mockLaterTaskService: Partial<LaterTaskService>;

  const mockTasks: Tasks[] = [
    new Tasks(1, 'Task 1', false, false, 'Low', 1, undefined),
    new Tasks(2, 'Task 2', false, true, 'Low', 1, undefined),
  ];

  beforeEach(async () => {
    // Arrange: setup signals
    const projectIdSignal = signal(1);
    const taskSignal = signal<Tasks[]>(mockTasks);

    // Arrange: mock services
    mockProjectService = { idSubject: projectIdSignal };
    mockLaterTaskService = { myTasksFiltered: taskSignal };

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, MatProgressSpinnerModule, CommonModule],
      providers: [
        { provide: ProjectService, useValue: mockProjectService },
        { provide: LaterTaskService, useValue: mockLaterTaskService },
        { provide: EventService, useValue: { emit: jasmine.createSpy('emit') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ---------- Basic ----------

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ---------- Spinner Visibility ----------

  it('should show spinner when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should not show spinner when isLoading is false', () => {
    component.isLoading = false;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
    expect(spinner).toBeNull();
  });

  // ---------- Task Rendering ----------

  it('should render task items when filteredTasksById returns tasks', () => {
    component.isLoading = false;
    fixture.detectChanges();
    const taskItems = fixture.debugElement.queryAll(By.css('app-task-item'));
    expect(taskItems.length).toBe(2);
  });

  // ---------- Event Emission ----------

  it('should emit toggled event when handleToggle() is called', () => {
    spyOn(component.toggled, 'emit');
    const task = mockTasks[0];
    component.handleToggle(task);
    expect(component.toggled.emit).toHaveBeenCalledWith(task);
  });
});
