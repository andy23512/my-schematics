import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface <%= classify(name) %>ComponentState {
}

@Injectable()
export class <%= classify(name) %>ComponentStore extends ComponentStore<<%= classify(name) %>ComponentState> {
}
