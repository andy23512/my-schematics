import { Directive } from '@angular/core';

@Directive({
  selector: '[<%= classify(name) %>]',<% if(standalone) {%>
  imports: [],<%} else { %>
  standalone: false,<% }%>
})
export class <%= classify(name) %>Directive {
  constructor() { }
}
