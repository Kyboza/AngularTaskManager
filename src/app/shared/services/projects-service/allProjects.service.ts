import { Injectable, PLATFORM_ID, Inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Projects } from '../../models/projects';
import { parseProjects } from '../../utility/parseProjects';

@Injectable({
  providedIn: 'root'
})
export class AllProjectsService {
  private myProjectsSubject = signal<Projects[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadProjects();
  }

  public loadProjects(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedProjects = localStorage.getItem('savedProjects');
      const parsedProjects = savedProjects ? parseProjects(savedProjects) : [];
      this.myProjectsSubject.set(parsedProjects);
    } else {
      this.myProjectsSubject.set([]);
    }
  }

  public get myProjects() {
    return this.myProjectsSubject;
  }
  
  public setMyProjects(projects: Projects[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('savedProjects', JSON.stringify(projects));
    }
    this.myProjectsSubject.set(projects);
  }
}

