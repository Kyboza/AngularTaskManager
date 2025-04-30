import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

import { GenericButtonComponent } from '../../shared/generic-button/generic-button.component';
import { noWhitespaceValidator } from '../../shared/custom-validators/customValidatorWS';
import { Projects } from '../../shared/models/projects';
import { AllProjectsService } from '../../shared/services/projects-service/allProjects.service';
import { SnackbarService } from '../../shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    GenericButtonComponent,
  ],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {
  public myProjects!: Signal<Projects[]>;

  public newProject: FormGroup = new FormGroup({
    projectText: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30),
      noWhitespaceValidator,
    ]),
    projectPrio: new FormControl('', [Validators.required]),
  });

  public constructor(
    private snackBar: SnackbarService,
    private allProjectsService: AllProjectsService,
    private router: Router,
  ) {
    this.myProjects = this.allProjectsService.myProjects;
  }

  public ngOnInit(): void {}

  public createProject(): void {
    const projectText = this.newProject.get('projectText')?.value;
    const projectPrio = this.newProject.get('projectPrio')?.value;

    if (this.newProject.invalid || !projectText || !projectPrio) return;

    const lastId =
      this.allProjectsService.myProjects()[this.allProjectsService.myProjects().length - 1]?.id ??
      0;

    const project = new Projects(lastId + 1, projectText, undefined, projectPrio);

    const allProjects = [...this.allProjectsService.myProjects(), project];
    this.allProjectsService.setMyProjects(allProjects);

    this.router.navigate(['']).then(() => {
      this.newProject.reset();
      this.snackBar.show('Added Projects', 'success');
    });
  }

  public get projectTextErrors(): string[] {
    const control = this.newProject.get('projectText');
    if (!control || !control.touched || !control.errors) return [];

    const errors: string[] = [];

    if (control.errors['required']) errors.push('This Is Required');
    if (control.errors['minlength']) errors.push('Min 5 characters required');
    if (control.errors['maxlength']) errors.push('Max 30 characters allowed');
    if (control.errors['whitespace']) errors.push('Project name cannot be only blank characters');

    return errors;
  }
}
