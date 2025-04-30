import { TestBed } from '@angular/core/testing';

import { AllProjectsService } from './allProjects.service';

describe('ProjectsService', () => {
  let service: AllProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
