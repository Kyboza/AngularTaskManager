import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tasks } from '../../../../../shared/models/tasks';
import { EventService } from '../../../../../shared/services/event-service/event.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-task-item',
  imports: [CommonModule, MatIconModule, MatCheckboxModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  @Input() task!: Tasks
  @Input() isLast: boolean = false;
  @Output() toggled = new EventEmitter<Tasks>()
  @Output() enableBlur = new EventEmitter<boolean>()
  @Output() enableEdit = new EventEmitter<[boolean, Tasks]>();



  public noEdit: boolean = false

  constructor(public events: EventService){}

  removeTask = (task: Tasks) => {
    const savedTodos = localStorage.getItem('savedTodos')
    if(savedTodos){
      this.events.emit('removeTask', task);
    }
    
  }

  toggleCompleted = () => {
    this.task.completed = !this.task.completed;
    this.toggled.emit(this.task); // Skickar ut Tasks-objektet korrekt
  };

  toggleStarted = () => {
    this.task.started = !this.task.started
    this.toggled.emit(this.task);
  }

  editTask = (task: Tasks) => {
    this.enableBlur.emit(true)
    this.enableEdit.emit([true, task]);
    this.noEdit = !this.noEdit; // visar inputfältet via *ngIf
  }

  

}
