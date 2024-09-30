import { Directive } from '@angular/core';

@Directive({
  selector: '[<%= classify(name) %>]',
})
export class <%= classify(name) %>Directive {
  constructor() { }
}
