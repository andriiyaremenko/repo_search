import { Action, FoundAction, ShowAction } from './actions'
import { AppState, Search } from '../state';
import { Repo } from '../types'

const nullSearch = {
    term: '',
    page: 1,
    pageSize: 30,
    sort: 'stars',
    order: 'desc'
}

export const initialState: AppState = {
    found: new Map<string, [Search, Repo[]]>(),
    shown: { search: nullSearch, result: [] },
};

export default function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'FOUND':
            return found(state, action)
        case 'SHOW':
            return show(state, action)
        default:
            return state;
    }
}


function found(state: AppState, action: FoundAction): AppState {
    state.found = state.found.set(stringifySearch(action.search), [action.search, action.result]);
    return { ...state };
}

function show(state: AppState, action: ShowAction): AppState {
    const [search, items] = state.found.get(stringifySearch(action.search)) || [nullSearch, []];
    state.shown.search = search;
    state.shown.result = items;
    return { ...state };
}
export function stringifySearch(s: Search): string {
    return JSON.stringify({ ...s, count: undefined });
}
