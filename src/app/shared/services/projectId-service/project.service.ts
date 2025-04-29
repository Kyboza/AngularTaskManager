import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectIdSubject = signal<number | null>(null);

  constructor() {}

  public get idSubject() {
    return this.projectIdSubject;
  }

  public setProjectId(id: number | null): void {
    this.projectIdSubject.set(id);
  }
}
