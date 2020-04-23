import React from 'react';
import './App.css';
import Search from './Search';
import { useStore } from './state/store';
import { combineDemuplexers, handleGithubApi, logActions, throttleActions } from './state/demuplexers';
import { ActionType, Action } from './state/actions';
import { Context } from './state'
import Container from '@material-ui/core/Container';
import RepoTable from './RepoTable';

function App() {
    const conf = new Map<ActionType<Action>, number>();
    conf.set('SEARCH', 1000)
    const [state, dispatch] = useStore(combineDemuplexers(throttleActions(conf), handleGithubApi, logActions));

    return (
        <Context.Provider value={{ state, dispatch }}>
            <div className='App'>
                <Container fixed>
                    <Search></Search>
                    <RepoTable></RepoTable>
                </Container>
            </div>
        </Context.Provider>
    );
}

export default App;
