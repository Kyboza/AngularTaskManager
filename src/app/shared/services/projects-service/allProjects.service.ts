import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Projects } from '../../models/projects';
import { parseProjects } from '../../utility/parseProjects';

@Injectable({
  providedIn: 'root'
})
export class AllProjectsService {
  private myProjectsSubject = new BehaviorSubject<Projects[]>([]);
  myProjects$ = this.myProjectsSubject.asObservable();

  constructor() {
    this.loadProjects();
  }

  // Hämta projekt från localStorage
  private loadProjects() {
    const savedProjects = localStorage.getItem('savedProjects');
    const parsedProjects = savedProjects ? parseProjects(savedProjects) : [];
    this.myProjectsSubject.next(parsedProjects);
  }

  // Uppdatera projekten
  setMyProjects(projects: Projects[]) {
    localStorage.setItem('savedProjects', JSON.stringify(projects));
    this.myProjectsSubject.next(projects);
  }
}
