import { Component, Signal, computed, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Tasks } from '../../../../shared/models/tasks';
import { TaskItemComponent } from './task-item/task-item.component';
import { noWhitespaceValidator } from '../../../../shared/custom-validators/customValidatorWS';
import { EventService } from '../../../../shared/services/event-service/event.service';
import { ProjectService } from '../../../../shared/services/projectId-service/project.service';
import { LaterTaskService } from '../../../../shared/services/later-task-service/later-task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    TaskItemComponent,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  @Input() public isLoading: boolean = true;
  @Output() public toggled = new EventEmitter<Tasks>();

  public isBlur: boolean = false;
  public isEdit: boolean = false;
  public currentTask: Tasks | null = null;
  public isLast: boolean = false;
  public selectProjectId: Signal<number | null>;

  public taskEdit: FormGroup = new FormGroup({
    taskText: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
      noWhitespaceValidator
    ])
  });

  public constructor(
    private events: EventService,
    private projectService: ProjectService,
    private laterTaskService: LaterTaskService
  ) {
    this.selectProjectId = this.projectService.idSubject;
  }

  public filteredTasksById = computed(() =>
    this.laterTaskService.myTasksFiltered().filter(
      task => task.projectId === this.selectProjectId()
    )
  );

  public handleEdit(value: boolean, task?: Tasks): void {
    this.isEdit = value;
    if (value && task) {
      this.currentTask = task;
      this.taskEdit.patchValue({ taskText: task.todo });
    }
  }

  public handleToggle(task: Tasks): void {
    this.toggled.emit(task);
  }

  public handleBlur(value: boolean): void {
    this.isBlur = value;
  }

  public submitEdit(): void {
    if (this.taskEdit.valid && this.currentTask) {
      this.currentTask.todo = this.taskEdit.value.taskText;
      this.isEdit = false;
      this.isBlur = false;
      this.events.emit('updateTask', this.currentTask);
    }
  }

  public get taskTextErrors(): string[] {
    const control = this.taskEdit.get('taskText');
    if (!control || !control.touched || !control.errors) return [];

    const errors: string[] = [];

    if (control.errors['required']) errors.push('This is Required');
    if (control.errors['maxlength']) errors.push('Max 25 Characters Allowed');
    if (control.errors['minlength']) errors.push('Must Provide At least 5 Characters');
    if (control.errors['whitespace']) errors.push('Task cannot be only spaces');

    return errors;
  }
}
