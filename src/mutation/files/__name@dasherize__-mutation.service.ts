import { Injectable } from '@angular/core';
import {
  Mutation,
  Mutation<%= classify(name) %>MutationArgs
} from '@frontend/interface';
import { Mutation as MutationService } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class <%= classify(name) %>MutationService extends MutationService<
  Pick<Mutation, '<%= camelize(name) %>Mutation'>,
  Mutation<%= classify(name) %>MutationArgs
> {
  document = gql`
    mutation <%= classify(name) %>Mutation {
      <%= camelize(name) %>Mutation {
      }
    }
  `;
}
