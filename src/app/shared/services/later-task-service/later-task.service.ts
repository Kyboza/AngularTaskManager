import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { Tasks } from '../../models/tasks';
import { parseTasks } from '../../utility/parseTasks';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LaterTaskService {
  private myTaskSubject = signal<Tasks[]>([])
  
  constructor(@Inject(PLATFORM_ID)private platformId: Object) {
    if(isPlatformBrowser(this.platformId)){
      this.loadTasks()
    }
   }
  
   private loadTasks = () => {
    const savedTodos = localStorage.getItem('savedTodos');
    const parsedTasks = savedTodos ? parseTasks(savedTodos) : [];
    this.myTaskSubject.set(parsedTasks);
   }

   get myTasks() {
    return this.myTaskSubject
   }

  setTasks = (tasks: Tasks[]) => {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('savedTodos', JSON.stringify(tasks))
    }
    this.myTaskSubject.set(tasks)
  }
}
