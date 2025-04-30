import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { Tasks } from '../../../../../shared/models/tasks';
import { HoverColorDirective } from '../../../../../shared/custom-directive/hover-color';
import { CapitalizePipe } from '../../../../../shared/custom-pipe/capitalize';
import { EventService } from '../../../../../shared/services/event-service/event.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, CapitalizePipe, HoverColorDirective, MatIconModule, MatCheckboxModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  @Input() public task!: Tasks;
  @Input() public isLast: boolean = false;

  @Output() public toggled = new EventEmitter<Tasks>();
  @Output() public enableBlur = new EventEmitter<boolean>();
  @Output() public enableEdit = new EventEmitter<[boolean, Tasks]>();

  public noEdit: boolean = false;

  public constructor(public events: EventService) {}

  public removeTask(task: Tasks): void {
    const savedTodos = localStorage.getItem('savedTodos');
    if (savedTodos) {
      this.events.emit('removeTask', task);
    }
  }

  public toggleCompleted(): void {
    this.task.completed = !this.task.completed;
    this.toggled.emit(this.task);
  }

  public toggleStarted(): void {
    this.task.started = !this.task.started;
    this.toggled.emit(this.task);
  }

  public editTask(task: Tasks): void {
    this.enableBlur.emit(true);
    this.enableEdit.emit([true, task]);
    this.noEdit = !this.noEdit;
  }
}
