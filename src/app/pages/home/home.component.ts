import { Component} from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskTodosComponent } from './task-todos/task-todos.component';
import { ProjectsComponent } from './projects/projects.component';


@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    TaskTodosComponent,
    ProjectsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  {
  selectProjectId: number | null = null;
}
