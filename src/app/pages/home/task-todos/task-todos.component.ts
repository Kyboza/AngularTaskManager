import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Output, EventEmitter} from '@angular/core';
import { TaskCompletionComponent } from './task-completion/task-completion.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFilterComponent } from './task-filter/task-filter.component';
import { GenericButtonComponent } from '../../../shared/generic-button/generic-button.component';

import { TaskService } from '../../../shared/services/task-service/task.service';
import { EventService } from '../../../shared/services/event-service/event.service';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { parseTasks } from '../../../shared/utility/parseTasks';
import { Tasks } from '../../../shared/models/tasks';
import { ProjectService } from '../../../shared/services/projectId-service/project.service';
import { MatIconModule } from '@angular/material/icon';
import { LaterTaskService } from '../../../shared/services/later-task-service/later-task.service';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-task-todos',
  imports: [TaskCompletionComponent, TaskFilterComponent, TaskListComponent, GenericButtonComponent, CommonModule, RouterModule, MatIconModule],
  templateUrl: './task-todos.component.html',
  styleUrl: './task-todos.component.scss'
})
export class TaskTodosComponent implements OnInit, OnDestroy {
  @Output() select = new EventEmitter<number>();



  public myTasks: Tasks[] = [];
  public isLoading: boolean = true;
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private events: EventService,
    private tasks: TaskService,
    private snackBar: SnackbarService,
    private projectService: ProjectService,
    private laterTasksService: LaterTaskService
  ) {
    // Remove Task
    this.subscriptions.push(this.events.listen('removeTask', (payload: Tasks) => {
      const savedTodos = localStorage.getItem('savedTodos');
      const todos = parseTasks(savedTodos);

      const index = todos.findIndex(task => task.todo === payload.todo);
      if (index > -1) {
        todos.splice(index, 1);
        localStorage.setItem('savedTodos', JSON.stringify(todos));
        this.myTasks.splice(index, 1);
        this.snackBar.show('Removed Task', 'success');
      }
    }));

    // Add Task
    this.subscriptions.push(this.events.listen('addTask', (payload: Tasks) => {
      const savedTodos = localStorage.getItem('savedTodos');
      const todos = parseTasks(savedTodos);

      todos.push(payload);
      localStorage.setItem('savedTodos', JSON.stringify(todos));
      this.myTasks.push(payload);
      this.snackBar.show('Added Task', 'success');
    }));

    // Update Task
    this.subscriptions.push(this.events.listen('updateTask', (payload: Tasks) => {
      const savedTodos = localStorage.getItem('savedTodos');
      const todos = parseTasks(savedTodos);

      const updatedTasks = todos.map(task =>
        task.id === payload.id ? payload : task
      );

      this.myTasks = updatedTasks;
      localStorage.setItem('savedTodos', JSON.stringify(updatedTasks));
      this.snackBar.show('Updated Task', 'success');
    }));
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTodos = localStorage.getItem('savedTodos');
      const restoredTasks = parseTasks(savedTodos);

      if (restoredTasks.length > 0) {
        this.myTasks = [...restoredTasks.sort((a, b) => b.priorityValue - a.priorityValue)];
        this.isLoading = false;
      } else {
        this.tasks.getTasks().subscribe({
          next: (data: any) => {
            this.myTasks.push(
              ...data.todos.map((t: any) =>
                new Tasks(t.id, t.todo, t.started, t.completed, t.priority || 'Low', t.projectId, t.userId)
              )
            );

            this.myTasks.sort((a, b) => b.priorityValue - a.priorityValue);
            localStorage.setItem('savedTodos', JSON.stringify(this.myTasks));
            this.laterTasksService.setTasks(this.myTasks)
            this.isLoading = false;
          },
          error: (err: any) =>
            this.snackBar.show(err.message || 'Failed to load tasks', 'error'),
        });

        window.addEventListener('storage', this.handleStorageChange);
      }
    } else {
      this.myTasks = [];
    }
  }

  onToggleTask(task: Tasks): void {
    const savedTodos = localStorage.getItem('savedTodos');
    const todos = parseTasks(savedTodos);

    const index = todos.findIndex(t => t.id === task.id);
    if (index !== -1) {
      todos[index].completed = task.completed;
      todos[index].started = task.started;
      localStorage.setItem('savedTodos', JSON.stringify(todos));
    }
  }

  handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'savedTodos') {
      this.myTasks = parseTasks(event.newValue);
    }
  };

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());

    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageChange);
    }
  }

  updateDisplayId = (value: null) => {
    this.projectService.setProjectId(value)
  }

  filter = (task: any) => true;

  get filteredTasks(): Tasks[] {
    console.log(this.myTasks)
    return this.myTasks ? this.myTasks.filter(this.filter) : [];
  }

  get percentCompleted(): number {
    if (!this.myTasks || this.myTasks.length === 0) return 0;
    const completedCount = this.myTasks.filter(task => task.completed).length;
    return Math.round((completedCount / this.myTasks.length) * 100);
  }
}
