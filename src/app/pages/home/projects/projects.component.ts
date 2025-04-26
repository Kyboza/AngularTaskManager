import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Projects } from '../../../shared/models/projects';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProjectListComponent } from './project-list/project-list.component';

import { EventService } from '../../../shared/services/event-service/event.service';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { parseProjects } from '../../../shared/utility/parseProjects';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ProjectListComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  myProjects: Projects[] = [
    new Projects(1, 'Porn Videos', new Date()),
    new Projects(2, 'Porn Videos', new Date()),
    new Projects(3, 'Porn Videos', new Date()),
  ];

  public isLoading: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private events: EventService,
    private snackBar: SnackbarService
  ) {
    // Remove Task
    this.subscriptions.push(this.events.listen('removeProject', (payload: Projects) => {
      const savedProjects = localStorage.getItem('savedProjects');
      const projects = parseProjects(savedProjects);

      const index = projects.findIndex(project => project.title === payload.title);
      if (index > -1) {
        projects.splice(index, 1);
        localStorage.setItem('savedProjects', JSON.stringify(projects));
        this.myProjects.splice(index, 1);
        this.snackBar.show('Removed Project', 'success');
      }
    }));

    // Add Task
    this.subscriptions.push(this.events.listen('addProject', (payload: Projects) => {
      const savedProjects = localStorage.getItem('savedProjects');
      const projects = parseProjects(savedProjects);

      projects.push(payload);
      localStorage.setItem('savedProjects', JSON.stringify(projects));
      this.myProjects.push(payload);
      this.snackBar.show('Added Project', 'success');
    }));

    // Update Task
    this.subscriptions.push(this.events.listen('updateProject', (payload: Projects) => {
      const savedProjects = localStorage.getItem('savedProjects');
      const projects = parseProjects(savedProjects);

      const updatedProjects = projects.map(project =>
        project.id === payload.id ? payload : project
      );

      this.myProjects = updatedProjects;
      localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
      this.snackBar.show('Updated Project', 'success');
    }));
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedProjects = localStorage.getItem('savedProjects');
      const parsedProjects = savedProjects ? parseProjects(savedProjects) : []
      if(parsedProjects.length > 0){
        this.myProjects = parsedProjects
      }
      else{
        localStorage.setItem('savedProjects', JSON.stringify(this.myProjects))
      }
      this.isLoading = false;
      window.addEventListener('storage', this.handleStorageChange);
    } else {
      this.myProjects = []
    }
  }


  handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'savedProjects') {
      this.myProjects = parseProjects(event.newValue);
    }
  };

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());

    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageChange);
    }
  }

  // filter = (task: any) => true;

  // get filteredTasks(): Projects[] {
  //   return this.myProjects.filter(this.filter);
  // }

  // get percentCompleted(): number {
  //   if (!this.myProjects || this.myProjects.length === 0) return 0;
  //   const completedCount = this.myProjects.filter(task => task.completed).length;
  //   return Math.round((completedCount / this.myProjects.length) * 100);
  // }
}
