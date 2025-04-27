import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../shared/services/projectId-service/project.service';
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
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  selectProjectId: number | null = null; // För att hålla det valda projekt-id:t
  private projectSubscription!: Subscription; // Prenumeration för att lyssna på förändringar i ProjectService

  constructor(private projectService: ProjectService) {}

  // När komponenten initialiseras, prenumerera på projectId
  ngOnInit(): void {
    this.projectSubscription = this.projectService.projectId$.subscribe(
      id => {
        this.selectProjectId = id;
      }
    );
  }

  // Rensa prenumerationen när komponenten förstörs
  ngOnDestroy(): void {
    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe(); // Stäng av prenumerationen för att förhindra minnesläckor
    }
  }
}
