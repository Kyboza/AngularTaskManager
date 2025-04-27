import { TestBed } from '@angular/core/testing';

import { LaterTaskService } from './later-task.service';

describe('LaterTaskService', () => {
  let service: LaterTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaterTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
