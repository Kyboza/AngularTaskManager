import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectIdSubject = signal<number | null>(null)
  constructor() { }

  get idSubject () {
    return this.projectIdSubject
  }

  setProjectId = (id: number | null) => {
    this.projectIdSubject.set(id)
  }
}
