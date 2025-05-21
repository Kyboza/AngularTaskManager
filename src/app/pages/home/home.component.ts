import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../shared/services/projectId-service/project.service';
import { TaskTodosComponent } from './task-todos/task-todos.component';
import { ProjectsComponent } from './projects/projects.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TaskTodosComponent, ProjectsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public selectProjectId: Signal<number | null>;

  constructor(private projectService: ProjectService) {
    this.selectProjectId = this.projectService.idSubject;
  }
}
