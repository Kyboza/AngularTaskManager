import { Component, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { GenericButtonComponent } from '../../shared/generic-button/generic-button.component';
import { noWhitespaceValidator } from '../../shared/custom-validators/customValidatorWS';
import { Tasks } from '../../shared/models/tasks';
import { Projects } from '../../shared/models/projects';
import { AllProjectsService } from '../../shared/services/projects-service/allProjects.service';
import { LaterTaskService } from '../../shared/services/later-task-service/later-task.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    CommonModule,
    GenericButtonComponent,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent {
  public myProjects!: Signal<Projects[]>;
  public myTasks!: Signal<Tasks[]>;

  public newTask: FormGroup = new FormGroup({
    taskText: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
      noWhitespaceValidator
    ]),
    taskPrio: new FormControl('', [Validators.required]),
    taskProject: new FormControl('', [Validators.required])
  });

  public constructor(
    private allProjectsService: AllProjectsService,
    private laterTaskService: LaterTaskService,
    private router: Router
  ) {
    this.myTasks = this.laterTaskService.myTasks;
    this.myProjects = this.allProjectsService.myProjects;
  }

  public createTask(): void {
    const taskText = this.newTask.get('taskText')?.value;
    const taskProject = this.newTask.get('taskProject')?.value;
    const taskPrio = this.newTask.get('taskPrio')?.value;

    if (this.newTask.invalid || !taskText || !taskPrio) return;

    const task = new Tasks(
      Math.floor(Math.random() * 1000) + 1,
      taskText,
      false,
      false,
      taskPrio,
      taskProject,
      undefined
    );

    const allTasks = [...this.laterTaskService.myTasks(), task];
    this.laterTaskService.setTasks(allTasks);

    this.router.navigate(['']).then(() => {
      this.newTask.reset();
    });
  }

  public get taskTextErrors(): string[] {
    const control = this.newTask.get('taskText');
    if (!control || !control.touched || !control.errors) return [];

    const errors: string[] = [];

    if (control.errors['required']) errors.push('This is Required');
    if (control.errors['maxlength']) errors.push('Max 25 Characters Allowed');
    if (control.errors['minlength']) errors.push('Must Provide At least 5 Characters');
    if (control.errors['whitespace']) errors.push('Task cannot be only spaces');

    return errors;
  }
}
