import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: '-<%= dasherize(name) %>',<% if(standalone) {%>
  standalone: true,<% }%>
  templateUrl: '<%= dasherize(name) %>.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>Component {
}
