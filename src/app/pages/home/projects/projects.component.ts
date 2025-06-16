import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Signal, computed, signal, Input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { Projects } from '../../../shared/models/projects';
import { ProjectListComponent } from './project-list/project-list.component';
import { GenericButtonComponent } from '../../../shared/generic-button/generic-button.component';
import { SearchbarComponent } from '../../../shared/searchbar/searchbar.component';
import { EventService } from '../../../shared/services/event-service/event.service';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { parseProjects } from '../../../shared/utility/parseProjects';
import { AllProjectsService } from '../../../shared/services/projects-service/allProjects.service';
import { TaskCompletionComponent } from '../task-todos/task-completion/task-completion.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectListComponent, GenericButtonComponent, RouterModule, SearchbarComponent, TaskCompletionComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
   @Input() public selectProjectId: number | null = null;
  public myProjects!: Signal<Projects[]>;
  public isLoading: boolean = false;
  public searchTerm = signal('');
  public isBrowser: boolean = false;
  private subscriptions: Subscription[] = [];

  public constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private events: EventService,
    private snackBar: SnackbarService,
    private allProjectsService: AllProjectsService,
  ) {
   this.isBrowser = isPlatformBrowser(platformId);
    this.myProjects = this.allProjectsService.getMyProjects;

    this.subscriptions.push(
      this.events.listen('removeProject', (payload: Projects) => {
        const savedProjects = localStorage.getItem('savedProjects');
        const projects = parseProjects(savedProjects);
        const index = projects.findIndex((project) => project.title === payload.title);

        if (index > -1) {
          projects.splice(index, 1);
          localStorage.setItem('savedProjects', JSON.stringify(projects));
          this.allProjectsService.setMyProjects(projects);
          this.snackBar.show('Removed Project', 'success');
        }
      }),
    );

 this.subscriptions.push(
  this.events.listen('updateProject', (payload: Projects) => {
    const projects = this.allProjectsService.getMyProjects();
    const updatedProjects = projects.map((project) =>
      project.id === payload.id ? payload : project
    );

    this.allProjectsService.setMyProjects(updatedProjects);
    localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
    this.snackBar.show('Updated Project', 'success');
  }),
);


  }

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedProjects = localStorage.getItem('savedProjects');
      const parsedProjects = savedProjects ? parseProjects(savedProjects) : [];

      if (parsedProjects.length > 0) {
        this.allProjectsService.setMyProjects(
          parsedProjects.sort((a, b) => b.priorityValue - a.priorityValue),
        );
      } else {
        this.allProjectsService.setMyProjects([]);
        localStorage.setItem('savedProjects', JSON.stringify([]));
      }

      this.isLoading = false;
      window.addEventListener('storage', this.handleStorageChange);
    } else {
      this.allProjectsService.setMyProjects([]);
      this.isLoading = false;
    }
  }

  public onToggleProject(project: Projects): void {
  const projects = this.myProjects();

  const updatedProjects = projects.map((p) => {
    if (p.id === project.id) {
      return new Projects(
        p.id,
        p.title,
        p.deadline,
        project.completed,
        p.priority
      );
    }
    return p;
  });

  localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
  this.allProjectsService.setMyProjects(updatedProjects);
}


  private handleStorageChange = (event: StorageEvent): void => {
    if (event.key === 'savedProjects') {
      this.allProjectsService.setMyProjects(parseProjects(event.newValue));
    }
  };

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());

    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageChange);
    }
  }

   public get percentCompleted(): number {
      const projects = this.myProjects();
      if (!projects || projects.length === 0) return 0;

      const completedCount = projects.filter(project => project.completed).length;
      const totalCount = projects.length;

      return Math.round((completedCount / totalCount) * 100);
  }



//Filter Funktion

onSearchTerm(term: string) {
  this.searchTerm.set(term)
}


filteredProjects = computed(() =>
  this.myProjects().filter(project =>
    project.title.toLowerCase().includes(this.searchTerm().toLowerCase())
  )
);
}
