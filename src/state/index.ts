import React from 'react';
import { initialState } from './reducer'
import { Repo } from '../types';
import {Action} from './actions'

export type Search = {
    term: string;
    page: number;
    pageSize: number;
    sort: string;
    order: string;
    count?: number;
};

export type AppState = {
    found: Map<string, [Search, Repo[]]>;
    shown: { search: Search, result: Repo[] };
};

export function searchTerm(term: string): Search {
    return {
        term: term,
        page: 1,
        pageSize: 30,
        sort: 'stars',
        order: 'desc'
    }
}

export const Context = React.createContext({ state: initialState, dispatch: (_: Action) => { } });
