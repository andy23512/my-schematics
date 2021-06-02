import { Injectable } from '@angular/core';
import { Query, Query<%= classify(name) %>Args } from '@frontend/interface';
import { gql, Query as QueryService } from 'apollo-angular';

export const <%= upperCaseUnderscore(name) %>_QUERY_GQL = gql`
  query <%= classify(name) %> {
    <%= camelize(name) %> {
    }
  }
`;

@Injectable({provideIn: 'root'})
export class <%= classify(name) %>QueryService extends QueryService<
  Pick<Query, '<%= camelize(name) %>'>,
  Query<%= classify(name) %>Args
> {
  public document = <%= upperCaseUnderscore(name) %>_QUERY_GQL;
}
