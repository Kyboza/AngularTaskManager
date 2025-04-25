import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { TaskFilterComponent } from './task-filter.component';
import { Tasks } from '../../../shared/models/tasks';

describe('TaskFilterComponent', () => {
  let component: TaskFilterComponent;
  let fixture: ComponentFixture<TaskFilterComponent>;
  
  const filters = [
    (task: Tasks) => task,
    (task: Tasks) => task.completed,
    (task: Tasks) => !task.completed
  ]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFilterComponent, FormsModule, MatSelectModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default filter', () => {
    expect(component.listFilter).toBe('0');
    expect(component.filter).toBe(filters[0]); // Förvänta att filter[0] (alla uppgifter) ska vara standard
  });

  it('should update the filter correctly', () => {
    spyOn(component.filterChange, 'emit');
    
    // Testa filter med "1" (completed tasks)
    component.updateFilter(1);
    expect(component.filter).toBe(filters[1]); // Förvänta att filter[1] (completed tasks) tillämpas
    expect(component.filterChange.emit).toHaveBeenCalledWith(filters[1]);

    // Testa filter med "2" (uncompleted tasks)
    component.updateFilter(2);
    expect(component.filter).toBe(filters[2]); // Förvänta att filter[2] (uncompleted tasks) tillämpas
    expect(component.filterChange.emit).toHaveBeenCalledWith(filters[2]);
  });

  it('should emit correct filter on filter change', () => {
    spyOn(component.filterChange, 'emit');
    
    // Ändra filter till "Fulfilled"
    component.updateFilter(1);
    expect(component.filterChange.emit).toHaveBeenCalledWith(filters[1]);

    // Ändra filter till "Unfulfilled"
    component.updateFilter(2);
    expect(component.filterChange.emit).toHaveBeenCalledWith(filters[2]);
  });

  it('should display filter options correctly', () => {
    fixture.detectChanges(); // Tvinga en omrendering av komponenten
    const select = fixture.debugElement.query(By.css('mat-select'));
    const options = select.nativeElement.querySelectorAll('mat-option');
    
    // Kontrollera att alla tre filteralternativ visas korrekt
    expect(options.length).toBe(3);
    expect(options[0].textContent).toContain('All');
    expect(options[1].textContent).toContain('Fulfilled');
    expect(options[2].textContent).toContain('Unfulfilled');
  });
});
