import { Component} from '@angular/core';
import { Tasks } from '../../../../shared/models/tasks';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from './task-item/task-item.component';
import { Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Output, EventEmitter } from '@angular/core';
import { MatLabel } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { noWhitespaceValidator } from '../../../create-task/customValidatorWS';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { EventService } from '../../../../shared/services/event-service/event.service';



@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskItemComponent, MatProgressSpinnerModule, MatLabel, ReactiveFormsModule, MatFormField, MatIconModule, MatInputModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  @Input() myTasks: Tasks[] = []
  @Input() isLoading: boolean = true;
  @Output() toggled = new EventEmitter<Tasks>();
  
  constructor(private events: EventService){}
  

  public isBlur: boolean = false;
  public isEdit: boolean = false;
  currentTask: Tasks | null = null;

  taskEdit: FormGroup = new FormGroup({
    taskText: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25), noWhitespaceValidator])
  })


handleEdit(value: boolean, task?: Tasks) {
  this.isEdit = value;
  if (value && task) {
    this.currentTask = task;
    this.taskEdit.patchValue({ taskText: task.todo });
  }
}

  handleToggle(task: Tasks) {
    this.toggled.emit(task);
  }

  handleBlur = (value: boolean) => {
    this.isBlur = value;
  }

  submitEdit = () => {
    if (this.taskEdit.valid && this.currentTask) {
      this.currentTask.todo = this.taskEdit.value.taskText;
      this.isEdit = false;
      this.isBlur = false;
      this.events.emit('updateTask', this.currentTask)
    }
  }

  get taskTextErrors(): string[] {
    const control = this.taskEdit.get('taskText');
    if (!control || !control.touched || !control.errors) return [];
  
    const errors = [];
  
    if (control.errors['required']) {
      errors.push('This is Required');
    }
    if(control.errors['maxlength']){
      errors.push('Max 25 Characters Allowed')
    }
    if (control.errors['minlength']) {
      errors.push('Must Provide At least 5 Characters');
    }
    if (control.errors['whitespace']) {
      errors.push('Task cannot be only spaces');
    }
  
    return errors;
  }
}
