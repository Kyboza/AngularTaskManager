import { Injectable, PLATFORM_ID, Inject, signal } from '@angular/core';
import { Projects } from '../../models/projects';
import { parseProjects } from '../../utility/parseProjects';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AllProjectsService {
  private myProjectsSubject = signal<Projects[]>([])

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadProjects();
  }

  public loadProjects() {
    if (isPlatformBrowser(this.platformId)) {
      const savedProjects = localStorage.getItem('savedProjects');
      const parsedProjects = savedProjects ? parseProjects(savedProjects) : [];
      this.myProjectsSubject.set(parsedProjects);
    } else {
      this.myProjectsSubject.set([]);
    }
  }

  get myProjects() {
    return this.myProjectsSubject;
  }
  
  setMyProjects(projects: Projects[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('savedProjects', JSON.stringify(projects));
    }
    this.myProjectsSubject.set(projects);
  }
}
