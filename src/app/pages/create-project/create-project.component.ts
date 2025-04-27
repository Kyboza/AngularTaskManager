import { Component, OnInit } from '@angular/core';
import { MatLabel } from '@angular/material/select';
import { MatFormField } from '@angular/material/select';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { GenericButtonComponent } from '../../shared/generic-button/generic-button.component';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { noWhitespaceValidator } from '../create-task/customValidatorWS';
import { MatInputModule } from '@angular/material/input';
import { Projects } from '../../shared/models/projects';
import { AllProjectsService } from '../../shared/services/projects-service/allProjects.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-create-project',
  imports: [MatLabel, MatFormField, MatSelect, MatOption, MatInputModule, GenericButtonComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent implements OnInit {
  myProjects: Projects[] = []

  constructor(private snackBar: SnackbarService, private allProjectsService: AllProjectsService, private router: Router){}

  newProject: FormGroup = new FormGroup({
    projectText: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30), noWhitespaceValidator]),
    projectPrio: new FormControl('', [Validators.required])
  })

  ngOnInit(): void {
    this.allProjectsService.myProjects$.subscribe(projects => {
      this.myProjects = projects
    })
  }


  createProject = () => {
    const projectText = this.newProject.get('projectText')?.value;
    const projectPrio = this.newProject.get('projectPrio')?.value;

    if(this.newProject.invalid || !projectText || !projectPrio) return;

    console.log(projectPrio)

    const project = new Projects(
      this.myProjects[this.myProjects.length -1]?.id + 1 || 1,
      projectText,
      new Date(),
      projectPrio
    )

    const allProjects = [...this.myProjects, project]
    console.log(allProjects)
    this.allProjectsService.setMyProjects(allProjects)

    this.router.navigate(['']).then(() => {
      this.newProject.reset()
      this.snackBar.show('Added Projects', 'success');
    })
  }

  get projectTextErrors(): string[] {
    const control = this.newProject.get('projectText');
    if(!control || !control.touched || !control.errors) return []

    const errors: string[] = []

    if(control.errors['required']){
      errors.push('This Is Required')
    }
    if(control.errors['minlength']){
      errors.push('Min 5 characters required')
    }
    if(control.errors['maxlength']){
      errors.push('Max 30 characters allowed')
    }
    if(control.errors['whitespace']){
      errors.push('Project name cannot be only blank characters')
    }
    return errors;
  }
}


