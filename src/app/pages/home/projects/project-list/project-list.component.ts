import { Component} from '@angular/core';
import { Projects } from '../../../../shared/models/projects';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Output, EventEmitter } from '@angular/core';
import { MatLabel } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { noWhitespaceValidator } from '../../../../shared/custom-validators/customValidatorWS';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { EventService } from '../../../../shared/services/event-service/event.service';
import { ProjectItemComponent } from './project-item/project-item.component';
@Component({
  selector: 'app-project-list',
  imports: [CommonModule, MatProgressSpinnerModule, MatLabel, ReactiveFormsModule, MatIconModule, MatFormField, MatInputModule, ProjectItemComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {
  @Input() myProjects: Projects[] = []
  @Input() isLoading: boolean = true;
  @Output() toggled = new EventEmitter<Projects>();

  constructor(private events: EventService){}
   public isBlur: boolean = false;
    public isEdit: boolean = false;
    currentProject: Projects| null = null;
    isLast: boolean = false;

    
  projectEdit: FormGroup = new FormGroup({
    projectText: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), noWhitespaceValidator])
  })

  submitEdit = () => {
    if(this.projectEdit.valid && this.currentProject){
      this.currentProject.title = this.projectEdit.value.projectText;
      this.isEdit = false;
      this.isBlur = false;
      this.events.emit('updateProject', this.currentProject)
    }
  }

  handleEdit(value: boolean, project?: Projects) {
    this.isEdit = value;
    if (value && project) {
      this.currentProject = project;
      this.projectEdit.patchValue({ projectText: project.title });
    }
  }
  
    handleToggle(project: Projects) {
      this.toggled.emit(project);
    }
  
    handleBlur = (value: boolean) => {
      this.isBlur = value;
    }

 get projectTextErrors(): string [] {
  const control = this.projectEdit.get('projectText');
  if(!control || !control.touched || !control.errors) return [];

  const errors: string[] = [];

  if(control.errors['required']){
    errors.push('This is required')
  }
  if(control.errors['minlength']){
    errors.push('Min 5 characters required')
  }
  if(control.errors['maxlength']){
    errors.push('Max 25 characters allowed')
  }
  if(control.errors['whitespace']){
    errors.push('Project name cannot be only spaces')
  }
  return errors
 }
}
