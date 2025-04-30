import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateTaskComponent } from './pages/create-task/create-task.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create-task', component: CreateTaskComponent },
  { path: 'create-project', component: CreateProjectComponent },
  { path: '**', component: NotFoundComponent },
];
