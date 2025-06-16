import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Input, Signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

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
import { LaterTaskService } from '../../../shared/services/later-task-service/later-task.service';
import { AllProjectsService } from '../../../shared/services/projects-service/allProjects.service';

@Component({
  selector: 'app-task-todos',
  standalone: true,
  imports: [
    TaskCompletionComponent,
    TaskFilterComponent,
    TaskListComponent,
    GenericButtonComponent,
    CommonModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './task-todos.component.html',
  styleUrl: './task-todos.component.scss',
})
export class TaskTodosComponent implements OnInit, OnDestroy {
  @Input() public selectProjectId: number | null = null;
  public filter: Signal<(task: Tasks) => boolean>;
  public myTasks!: Signal<Tasks[]>;
  public isLoading: boolean = true;
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private events: EventService,
    private tasksService: TaskService,
    private snackBar: SnackbarService,
    private projectService: ProjectService,
    private laterTasksService: LaterTaskService,
    private allProjects: AllProjectsService
  ) {
    this.myTasks = this.laterTasksService.myTasks;
    this.filter = this.laterTasksService.filter;

    this.subscriptions.push(
      this.events.listen('removeTask', (payload: Tasks) => {
        const savedTodos = localStorage.getItem('savedTodos');
        const todos = parseTasks(savedTodos);
        const index = todos.findIndex((task) => task.todo === payload.todo);
        if (index > -1) {
          todos.splice(index, 1);
          localStorage.setItem('savedTodos', JSON.stringify(todos));
          this.laterTasksService.setTasks(todos);
          this.snackBar.show('Removed Task', 'success');
        }
      }),
    );

    this.subscriptions.push(
      this.events.listen('addTask', (payload: Tasks) => {
        const todos = this.myTasks();
        const updatedTodos = [...todos, payload];
        localStorage.setItem('savedTodos', JSON.stringify(updatedTodos));
        this.laterTasksService.setTasks(updatedTodos);
        this.snackBar.show('Added Task', 'success');
      }),
    );

    this.subscriptions.push(
      this.events.listen('updateTask', (payload: Tasks) => {
        const todos = this.myTasks();
        const updatedTodos = todos.map((task) => (task.id === payload.id ? payload : task));
        localStorage.setItem('savedTodos', JSON.stringify(updatedTodos));
        this.laterTasksService.setTasks(updatedTodos);
        this.snackBar.show('Updated Task', 'success');
      }),
    );
  }

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTodos = localStorage.getItem('savedTodos');
      const restoredTasks = savedTodos ? parseTasks(savedTodos) : [];

      if (restoredTasks.length > 0) {
        this.laterTasksService.setTasks(
          restoredTasks.sort((a, b) => b.priorityValue - a.priorityValue),
        );
        this.isLoading = false;
      } else {
        this.tasksService.getTasks().subscribe({
          next: (data: any) => {
            const loadedTasks = data.todos.map(
              (t: any) =>
                new Tasks(
                  t.id,
                  t.todo,
                  t.started,
                  t.completed,
                  t.priority || 'Low',
                  t.projectId,
                  t.userId,
                ),
            );
            const sortedTasks = loadedTasks.sort(
              (a: Tasks, b: Tasks) => b.priorityValue - a.priorityValue,
            );
            this.laterTasksService.setTasks(sortedTasks);
            localStorage.setItem('savedTodos', JSON.stringify(sortedTasks));
            this.isLoading = false;
          },
          error: (err: any) => {
            this.snackBar.show(err.message || 'Failed to load tasks', 'error');
          },
        });
      }

      window.addEventListener('storage', this.handleStorageChange);
    }
  }

  public onToggleTask(task: Tasks): void {
    const todos = this.myTasks();
    const updatedTodos = todos.map((t) => {
      if (t.id === task.id) {
        return new Tasks(
          t.id,
          t.todo,
          task.started,
          task.completed,
          t.priority,
          t.projectId,
          t.userId,
        );
      }
      return t;
    });
    localStorage.setItem('savedTodos', JSON.stringify(updatedTodos));
    this.laterTasksService.setTasks(updatedTodos);
    this.allProjects.updateProjectCompletion(task.projectId)
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageChange);
    }
  }

  private handleStorageChange = (event: StorageEvent): void => {
    if (event.key === 'savedTodos') {
      const parsedTasks = parseTasks(event.newValue);
      this.laterTasksService.setTasks(parsedTasks);
    }
  };

  public updateDisplayId(value: null): void {
    this.projectService.setProjectId(value);
  }

  public updateFilter(newFilter: (task: Tasks) => boolean): void {
    this.laterTasksService.updateFilter(newFilter);
  }

  public get percentCompleted(): number {
    const tasks = this.myTasks();
    if (!tasks || tasks.length === 0) return 0;
    const relevantTasks = tasks.filter((task) => task.projectId === this.selectProjectId);
    if (relevantTasks.length === 0) return 0;
    const completedTasks = relevantTasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / relevantTasks.length) * 100);
  }
}
