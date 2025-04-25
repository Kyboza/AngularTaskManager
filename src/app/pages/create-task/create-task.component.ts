import { Component } from '@angular/core';
import { GenericButtonComponent } from '../../shared/generic-button/generic-button.component';
import { MatFormField } from '@angular/material/select';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, ReactiveFormsModule, FormControl} from '@angular/forms';
import { Validators } from '@angular/forms';
import { EventService } from '../../shared/services/event-service/event.service';
import { CommonModule } from '@angular/common';
import { noWhitespaceValidator } from './customValidatorWS';
import { Tasks } from '../../shared/models/tasks';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-task',
  imports: [GenericButtonComponent, MatFormField, MatSelectModule, ReactiveFormsModule, MatInputModule, CommonModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
  constructor(private events: EventService, private router: Router){}

  newTask: FormGroup = new FormGroup({
    taskText: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(25), noWhitespaceValidator]),
    taskPrio: new FormControl("", [Validators.required])
  })

  createTask = () => {
    const taskText = this.newTask.get('taskText')?.value;
    const taskPrio = this.newTask.get('taskPrio')?.value;

    if(this.newTask.invalid || !taskText || !taskPrio) return;

    const task = new Tasks(
      Math.floor(Math.random() * 1000) + 1,
      taskText,                             
      false,
      undefined,                                                              
      taskPrio                               
    );
   
      this.router.navigate(['']).then(() => { 
      this.events.emit('addTask', task)              
      this.newTask.reset()
      })

  }


  get taskTextErrors(): string[] {
    const control = this.newTask.get('taskText');
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
