import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tasks } from '../../models/tasks';
import { parseTasks } from '../../utility/parseTasks';

@Injectable({
  providedIn: 'root'
})
export class LaterTaskService {
  private myTaskSubject = new BehaviorSubject<Tasks[]>([])
  myTasksSubject$ = this.myTaskSubject.asObservable();
  
  constructor() {
    this.loadTasks()
   }
  
   private loadTasks = () => {
    const savedTodos = localStorage.getItem('savedTodos');
    const parsedTasks = savedTodos ? parseTasks(savedTodos) : [];
    this.myTaskSubject.next(parsedTasks);
   }

  setTasks = (tasks: Tasks[]) => {
    localStorage.setItem('savedTodos', JSON.stringify(tasks))
    this.myTaskSubject.next(tasks)
  }
}
