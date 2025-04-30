import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private subject = new Subject<{ eventName: string; payload: any }>();

  emit = (eventName: string, payload: any) => {
    this.subject.next({ eventName, payload });
  };

  listen = (eventName: string, callback: (payload: any) => void): Subscription => {
    return this.subject.asObservable().subscribe((nextObj) => {
      if (eventName === nextObj.eventName) {
        callback(nextObj.payload);
      }
    });
  };
}
