import React, { useContext, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Action } from './state/actions';
import { Context, AppState, searchTerm } from './state';
import TextField from '@material-ui/core/TextField';
import { stringifySearch } from './state/reducer';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        searchForm: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
    }))

const handleSearch = (updateInput: (term: string) => void, dispatch: (action: Action) => void, state: AppState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value
        const search = searchTerm(term);
        updateInput(term);
        dispatch({ type: 'SEARCH', search: search, noFetch: state.found.has(stringifySearch(search)) })
    };

const handleCancel = (updateInput: (term: string) => void, dispatch: (action: Action) => void, state: AppState) =>
    () => {
        dispatch({ type: 'SEARCH', search: state.shown.search, noFetch: true });
        updateInput(state.shown.search.term);
    };

export default function Search() {
    const classes = useStyles();
    const { state, dispatch } = useContext(Context);
    const [inputState, updateInput] = useState(state.shown.search.term);
    return (
        <div className={classes.searchForm}>
            <TextField
                id='outlined-basic'
                placeholder="Type to start searching"
                label='Github Search'
                variant='outlined'
                onChange={handleSearch(updateInput, dispatch, state)}
                value={inputState}
            />
            <br />
            <Button variant='outlined' color='secondary' onClick={handleCancel(updateInput, dispatch, state)}>
                CANCEL
            </Button>
        </div>
    );
}
