import { Injectable, PLATFORM_ID, Inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Projects } from '../../models/projects';
import { parseProjects } from '../../utility/parseProjects';
import { Tasks } from '../../models/tasks';
import { parseTasks } from '../../utility/parseTasks';

@Injectable({
  providedIn: 'root',
})
export class AllProjectsService {
  private myProjectsSignal = signal<Projects[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadProjects();
  }

  public loadProjects(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedProjects = localStorage.getItem('savedProjects');
      const parsedProjects = savedProjects ? parseProjects(savedProjects) : [];
      this.myProjectsSignal.set(parsedProjects);
    } else {
      this.myProjectsSignal.set([]);
    }
  }

  public get getMyProjects() {
    return this.myProjectsSignal;
  }

  public setMyProjects(projects: Projects[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('savedProjects', JSON.stringify(projects));
    }
    this.myProjectsSignal.set(projects);
  }

 
  public updateProjectCompletion(projectId: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const tasks = parseTasks(localStorage.getItem('savedTodos'));
    const relevantTasks = tasks.filter(task => task.projectId === projectId);
 
    if (relevantTasks.length === 0) return;

    const allDone = relevantTasks.every(task => task.completed);

    const updatedProjects = this.myProjectsSignal().map(project =>
      project.id === projectId
        ? new Projects(
            project.id,
            project.title,
            project.deadline,
            allDone,
            project.priority
          )
        : project
    );

    localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
    this.myProjectsSignal.set(updatedProjects);
  }
}
