import { Injectable } from '@angular/core';
import { Query, Query<%= classify(name) %>Args } from '@frontend/interface';
import { Query as QueryService } from 'apollo-angular';
import gql from 'graphql-tag';

export const <%= upperCaseUnderscore(name) %>_QUERY_GQL = gql`
  query <%= classify(name) %> {
  }
`;

@Injectable()
export class <%= classify(name) %>QueryService extends QueryService<
  {
    <%= camelize(name) %>: Query['<%= camelize(name) %>'];
  },
  Query<%= classify(name) %>Args
> {
  public document = <%= upperCaseUnderscore(name) %>_QUERY_GQL;
}
