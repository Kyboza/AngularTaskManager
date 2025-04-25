import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskItemComponent } from './task-item.component';
import { Tasks } from '../../../../shared/models/tasks';
import { By } from '@angular/platform-browser';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '../../../../shared/services/event-service/event.service'; // Importera EventService

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  const taskMock = new Tasks(1, 'Feed the cat', true, undefined, 'Medium');

  // Mocka EventService
  class MockEventService {
    emit(event: string, data: any) {}
  }

  beforeEach(async () => {
    // Mocka localStorage
    spyOn(localStorage, 'getItem').and.returnValue('some value'); // Se till att localStorage alltid returnerar något

    await TestBed.configureTestingModule({
      imports: [TaskItemComponent, MatCheckboxModule, MatIconModule],
      providers: [
        { provide: EventService, useClass: MockEventService } // Mocka EventService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    component.task = taskMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render task text and priority', () => {
    const taskText = fixture.debugElement.query(By.css('.task-text')).nativeElement;
    const priority = fixture.debugElement.query(By.css('.task-priority p')).nativeElement;

    expect(taskText.textContent).toContain('Feed the cat');
    expect(priority.textContent).toContain('Medium');
  });



  it('should call EventService.emit when removeTask is called', () => {
    const emitSpy = spyOn(component.events, 'emit'); 

    component.removeTask(taskMock);
    expect(emitSpy).toHaveBeenCalledWith('removeTask', taskMock);
  });

  

  it('should emit "toggled" when checkbox is changed', () => {
    spyOn(component.toggled, 'emit');
    const checkbox = fixture.debugElement.query(By.css('mat-checkbox'));
    checkbox.triggerEventHandler('change', { checked: true });

    expect(component.toggled.emit).toHaveBeenCalledWith(taskMock);
  });
});
