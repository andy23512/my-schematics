import { TestBed } from '@angular/core/testing';

import { <%= classify(name) %>QueryService } from './<%= dasherize(name) %>-query.service';

describe('<%= classify(name) %>QueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: <%= classify(name) %>QueryService = TestBed.get(
      <%= classify(name) %>QueryService
    );
    expect(service).toBeTruthy();
  });
});
