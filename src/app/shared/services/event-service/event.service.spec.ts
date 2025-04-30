import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { Subscription } from 'rxjs';

describe('EventService', () => {
  let service: EventService;
  let subscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventService);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit and listen to the correct event', (done) => {
    const testPayload = { message: 'Hello World' };

    subscription = service.listen('testEvent', (payload) => {
      expect(payload).toEqual(testPayload);
      done();
    });

    service.emit('testEvent', testPayload);
  });

  it('should not call callback for different event names', () => {
    const callback = jasmine.createSpy('callback');
    subscription = service.listen('expectedEvent', callback);
    service.emit('otherEvent', { data: 'irrelevant' });

    expect(callback).not.toHaveBeenCalled();
  });
});
