import { TestBed } from '@angular/core/testing';

import { <%= classify(name) %>ComponentStore } from './<%= dasherize(name) %>.component-store';

describe('<%= classify(name) %>ComponentStore', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: <%= classify(name) %>ComponentStore = TestBed.inject(
      <%= classify(name) %>ComponentStore
    );
    expect(service).toBeTruthy();
  });
});
