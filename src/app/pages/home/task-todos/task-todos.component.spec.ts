import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTodosComponent } from './task-todos.component';

describe('TaskTodosComponent', () => {
  let component: TaskTodosComponent;
  let fixture: ComponentFixture<TaskTodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskTodosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
