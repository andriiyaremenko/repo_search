import { Action, FoundAction, ShowAction, ActionType } from './actions'
import { Repo } from '../types';
import { GithubRepoDto } from '../endpoints/github/dtos';
import { GithubRepos } from '../endpoints';

export type Demuplexer = (action: Action) => AsyncGenerator<Action>
export function combineDemuplexers(...demuplexers: Demuplexer[]) {
    return async function* combinedDemuplexers(action: Action) {
        yield* await demuplexers.reduce(async (asyncAggr, next) => {
            const aggr = await asyncAggr;
            return await aggr.reduce(async (asyncAs, a) => {
                const as = await asyncAs;
                for await (const act of next(a)) {
                    as.push(act);
                }
                return as;
            }, new Promise<Action[]>((resolve, _) => { resolve([]) }))
        }, new Promise<Action[]>((resolve, _) => resolve([action])))
    }
}
export async function demuplex(demuplexer: Demuplexer, action: Action, dispatch: (action: Action) => void) {
    for await (const act of demuplexer(action)) {
        dispatch(act);
    }
}

export async function* logActions(action: Action) {
    console.log(action);
    yield action;
}

export function throttleActions(configuration: Map<ActionType<Action>, number>) {
    const conf = new Map<ActionType<Action>, { token: { cancel: () => void }, time: number }>();
    configuration.forEach((v, action) => conf.set(action, { token: { cancel: () => { } }, time: v }))
    return async function* throttleActionsHandler(action: Action) {
        const c = conf.get(action.type);
        if (!c) {
            yield action;
        } else {
            c.token.cancel();

            const p = new Promise<Action>((resolve, reject) => {
                const t = setTimeout(() => {
                    resolve(action)
                }, c.time);
                c.token.cancel = () => {
                    clearTimeout(t)
                    reject('Skipped Action')
                };
            });
            yield await p;
        }
    }
}

export async function* handleGithubApi(action: Action) {
    switch (action.type) {
        case 'SEARCH':
            if (action.noFetch) {
                yield { type: 'SHOW', search: action.search } as ShowAction
                break;
            }
            if (!action.search.term) {
                console.log('canceled')
                break;
            }
            console.log(action)
            const search = action.search;
            const termS = `q=${search.term}`;
            const sortS = `sort=${search.sort}`;
            const orderS = `order=${search.order}`;
            const pageS = `page=${search.page}`;
            const perPageS = `per_page=${search.pageSize}`;
            yield* await fetch(`${GithubRepos}?${termS}&${sortS}&${orderS}&${pageS}&${perPageS}`)
                .then(res => res.json())
                .then(({ items: repos, total_count: count }: { items: GithubRepoDto[]; total_count: number }) =>
                    ({ repos: repos.map(map), count }))
                .then(({ repos, count }) => [
                    { type: 'FOUND', search: { ...search, count }, result: repos } as FoundAction,
                    { type: 'SHOW', search: { ...search, count } } as ShowAction,
                ])
            break;
        default:
            yield action;
    }
}

function map(dto: GithubRepoDto): Repo {
    return {
        name: dto.name,
        description: dto.description,
        ownerName: dto.owner.login,
        stars: dto.stargazers_count,
        url: dto.html_url
    }
}
