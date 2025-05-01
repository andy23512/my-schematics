import { Directive } from '@angular/core';

@Directive({
  selector: '[<%= classify(name) %>]',<% if(standalone) {%>
  standalone: true,<% }%>
})
export class <%= classify(name) %>Directive {
}
