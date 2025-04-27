import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectIdSubject = new BehaviorSubject<number | null>(null)
  projectId$ = this.projectIdSubject.asObservable()
  constructor() { }

  setProjectId = (id: number | null) => {
    this.projectIdSubject.next(id)
  }
}
