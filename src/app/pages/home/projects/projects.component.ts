import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Projects } from '../../../shared/models/projects';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProjectListComponent } from './project-list/project-list.component';
import { GenericButtonComponent } from '../../../shared/generic-button/generic-button.component';
import { RouterModule } from '@angular/router';

import { EventService } from '../../../shared/services/event-service/event.service';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { parseProjects } from '../../../shared/utility/parseProjects';
import { Subscription } from 'rxjs';
import { AllProjectsService } from '../../../shared/services/projects-service/allProjects.service';
import { Signal } from '@angular/core';


@Component({
  selector: 'app-projects',
  imports: [CommonModule, ProjectListComponent, GenericButtonComponent, RouterModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  myProjects!: Signal<Projects[]>

  public isLoading: boolean = false;
  private subscriptions: Subscription[] = [];

  


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private events: EventService,
    private snackBar: SnackbarService,
    private allProjectsService: AllProjectsService
  ) {

    this.myProjects = this.allProjectsService.myProjects

    // Remove Task
    this.subscriptions.push(this.events.listen('removeProject', (payload: Projects) => {
      const savedProjects = localStorage.getItem('savedProjects');
      const projects = parseProjects(savedProjects);

      const index = projects.findIndex(project => project.title === payload.title);
      if (index > -1) {
        projects.splice(index, 1);
        localStorage.setItem('savedProjects', JSON.stringify(projects));
        this.allProjectsService.setMyProjects(projects)
        this.snackBar.show('Removed Project', 'success');
      }
    }));

    // Update Task
    this.subscriptions.push(this.events.listen('updateProject', (payload: Projects) => {
      const savedProjects = localStorage.getItem('savedProjects');
      const projects = parseProjects(savedProjects);

      const updatedProjects = projects.map(project =>
        project.id === payload.id ? payload : project
      );

      this.allProjectsService.setMyProjects(updatedProjects)
      localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
      this.snackBar.show('Updated Project', 'success');
    }));
  }


  ngOnInit(): void {
    // Hämta initiala projekt när appen startar
    if (isPlatformBrowser(this.platformId)) {
      const savedProjects = localStorage.getItem('savedProjects');
      const parsedProjects = savedProjects ? parseProjects(savedProjects) : [];
  
      // Sätt myProjects till de hämtade projekten eller en tom array om inget finns
      if (parsedProjects.length > 0) {
        this.allProjectsService.setMyProjects(parsedProjects.sort((a, b) => b.priorityValue - a.priorityValue))
      } else {
        this.allProjectsService.setMyProjects([])
        localStorage.setItem('savedProjects', JSON.stringify(this.myProjects));
      }
  
      // Skicka initialiserade projekt till BehaviorSubject
      this.isLoading = false;
      window.addEventListener('storage', this.handleStorageChange);
    } else {
      this.allProjectsService.setMyProjects([]);
      this.isLoading = false;
    }
  
  }
  



  handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'savedProjects') {
      this.allProjectsService.setMyProjects(parseProjects(event.newValue))
    }
  };

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());

    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageChange);
    }
  }
}
