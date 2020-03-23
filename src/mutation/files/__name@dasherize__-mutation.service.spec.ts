import { TestBed } from '@angular/core/testing';

import { <%= classify(name) %>MutationService } from './<%= dasherize(name) %>-mutation.service';

describe('<%= classify(name) %>MutationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: <%= classify(name) %>MutationService = TestBed.get(
      <%= classify(name) %>MutationService
    );
    expect(service).toBeTruthy();
  });
});
