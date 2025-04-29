import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Projects } from '../../../../shared/models/projects';
import { noWhitespaceValidator } from '../../../../shared/custom-validators/customValidatorWS';
import { EventService } from '../../../../shared/services/event-service/event.service';
import { ProjectItemComponent } from './project-item/project-item.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    ProjectItemComponent
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent {
  @Input() public myProjects: Projects[] = [];
  @Input() public isLoading: boolean = true;
  @Output() public toggled = new EventEmitter<Projects>();

  public isBlur: boolean = false;
  public isEdit: boolean = false;
  public currentProject: Projects | null = null;
  public isLast: boolean = false;

  public projectEdit: FormGroup = new FormGroup({
    projectText: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30),
      noWhitespaceValidator
    ])
  });

  public constructor(private events: EventService) {}

  public submitEdit(): void {
    if (this.projectEdit.valid && this.currentProject) {
      this.currentProject.title = this.projectEdit.value.projectText;
      this.isEdit = false;
      this.isBlur = false;
      this.events.emit('updateProject', this.currentProject);
    }
  }

  public handleEdit(value: boolean, project?: Projects): void {
    this.isEdit = value;
    if (value && project) {
      this.currentProject = project;
      this.projectEdit.patchValue({ projectText: project.title });
    }
  }

  public handleToggle(project: Projects): void {
    this.toggled.emit(project);
  }

  public handleBlur(value: boolean): void {
    this.isBlur = value;
  }

  public get projectTextErrors(): string[] {
    const control = this.projectEdit.get('projectText');
    if (!control || !control.touched || !control.errors) return [];

    const errors: string[] = [];

    if (control.errors['required']) errors.push('This is required');
    if (control.errors['minlength']) errors.push('Min 5 characters required');
    if (control.errors['maxlength']) errors.push('Max 25 characters allowed');
    if (control.errors['whitespace']) errors.push('Project name cannot be only spaces');

    return errors;
  }
}
