import { useReducer } from 'react';
import { AppState } from '../state'
import { Action } from './actions'
import { Demuplexer, demuplex } from './demuplexers';
import reducer, { initialState } from './reducer';

export function useStore(demuplexer: Demuplexer): [AppState, (action: Action) => void] {
    const [state, disp] = useReducer(reducer, initialState);
    function dispatch(action: Action) {
        demuplex(demuplexer, action, disp).catch(console.log)
    }

    return [state, dispatch]
}
