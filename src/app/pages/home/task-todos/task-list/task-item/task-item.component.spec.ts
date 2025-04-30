import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskItemComponent } from './task-item.component';
import { Tasks } from '../../../../../shared/models/tasks';
import { By } from '@angular/platform-browser';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '../../../../../shared/services/event-service/event.service';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  const mockTask = new Tasks(1, 'Feed the cat', false, true, 'Medium', 1, undefined);

  // Mockad version av EventService
  class MockEventService {
    emit(event: string, data: any) {}
  }

  beforeEach(async () => {
    // Mocka localStorage
    spyOn(localStorage, 'getItem').and.returnValue('some value');

    await TestBed.configureTestingModule({
      imports: [TaskItemComponent, MatCheckboxModule, MatIconModule],
      providers: [{ provide: EventService, useClass: MockEventService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
    fixture.detectChanges();
  });

  // ---------- Basic ----------

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ---------- DOM Rendering ----------

  it('should render task text and priority', () => {
    const taskText = fixture.debugElement.query(By.css('.task-item__text')).nativeElement;
    const priority = fixture.debugElement.query(By.css('.task-item__priority p')).nativeElement;

    expect(taskText.textContent).toContain('Feed the cat');
    expect(priority.textContent).toContain('Medium');
  });

  // ---------- removeTask() ----------

  it('should call EventService.emit when removeTask is called', () => {
    const emitSpy = spyOn(component.events, 'emit');

    component.removeTask(mockTask);

    expect(emitSpy).toHaveBeenCalledWith('removeTask', mockTask);
  });

  // ---------- toggleCompleted() ----------

  it('should toggle completed and emit task in toggleCompleted()', () => {
    spyOn(component.toggled, 'emit');

    component.task.completed = false;

    component.toggleCompleted();

    expect(component.task.completed).toBeTrue();
    expect(component.toggled.emit).toHaveBeenCalledWith(mockTask);
  });

  // ---------- toggleStarted() ----------

  it('should toggle started and emit task in toggleStarted()', () => {
    spyOn(component.toggled, 'emit');

    component.task.started = false;

    component.toggleStarted();

    expect(component.task.started).toBeTrue();
    expect(component.toggled.emit).toHaveBeenCalledWith(mockTask);
  });

  // ---------- editTask() ----------

  it('should emit enableBlur and enableEdit and toggle noEdit on editTask()', () => {
    spyOn(component.enableBlur, 'emit');
    spyOn(component.enableEdit, 'emit');

    const previousNoEdit = component.noEdit;

    component.editTask(mockTask);

    expect(component.enableBlur.emit).toHaveBeenCalledWith(true);
    expect(component.enableEdit.emit).toHaveBeenCalledWith([true, mockTask]);
    expect(component.noEdit).toBe(!previousNoEdit);
  });

  // ---------- UI Interaction (Checkbox) ----------

  it('should emit "toggled" when checkbox is changed', () => {
    spyOn(component.toggled, 'emit');

    const checkbox = fixture.debugElement.query(By.css('mat-checkbox'));
    checkbox.triggerEventHandler('change', { checked: true });

    expect(component.toggled.emit).toHaveBeenCalledWith(mockTask);
  });
});
