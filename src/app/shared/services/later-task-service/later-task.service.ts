import { Injectable, signal, WritableSignal, computed, PLATFORM_ID, Inject, Signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Tasks } from '../../models/tasks';
import { parseTasks } from '../../utility/parseTasks';

@Injectable({
  providedIn: 'root'
})
export class LaterTaskService {
  public myTaskSubject: WritableSignal<Tasks[]> = signal([]);
  public filter: WritableSignal<(task: Tasks) => boolean> = signal((task: Tasks) => true);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTasks();
    }
  }

  public get myTasks(): Signal<Tasks[]> {
    return this.myTaskSubject;
  }

  public get myTasksFiltered(): Signal<Tasks[]> {
    return computed(() => this.myTaskSubject().filter(this.filter()));
  }

  public updateFilter(newFilter: (task: Tasks) => boolean): void {
    this.filter.set(newFilter);
  }

  public setTasks(tasks: Tasks[]): void {
    this.myTaskSubject.set(tasks);
  }

  private loadTasks(): void {
    const savedTodos = localStorage.getItem('savedTodos');
    const parsedTasks = savedTodos ? parseTasks(savedTodos) : [];
    this.myTaskSubject.set(parsedTasks);
  }
}
