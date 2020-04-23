import { Search } from '../state'
import { Repo } from '../types'

export type SearchAction = { type: 'SEARCH' } & { search: Search, noFetch?: boolean };
export type FoundAction = { type: 'FOUND' } & { search: Search; result: Repo[] }
export type ShowAction = { type: 'SHOW' } & { search: Search };
export type Action = SearchAction | FoundAction | ShowAction;
export type ActionType<A> = A extends { type: infer T } ? T : never;

