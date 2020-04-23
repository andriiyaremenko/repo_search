import React, { useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Context, AppState } from './state';
import { Action } from './state/actions';
import { stringifySearch } from './state/reducer';
import Skeleton from '@material-ui/lab/Skeleton';
import TablePagination from '@material-ui/core/TablePagination';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            marginTop: theme.spacing(3),
            minWidth: 650,
        },
        paging: {
            '& > *': {
                marginTop: theme.spacing(2),
            },
        }
    }))

const handlePageChange = (dispatch: (action: Action) => void, state: AppState) =>
    (_: unknown, value: number) => {
        const search = { ...state.shown.search, page: value };
        dispatch({ type: 'SEARCH', search: search, noFetch: state.found.has(stringifySearch(search)) })
    };

export default function RepoTable() {
    const classes = useStyles();
    const { state, dispatch } = useContext(Context);
    return (
        <TableContainer component={Paper}>
            {
                state.shown.search.term ?
                    <>
                        <Table className={classes.table} aria-label='simple table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Repository Name</TableCell>
                                    <TableCell align='left'>Owner Name</TableCell>
                                    <TableCell align='left'>Stars</TableCell>
                                    <TableCell align='left'>URL</TableCell>
                                    <TableCell align='left'>Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.shown.result.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell component='th' scope='row'>
                                            {row.name}
                                        </TableCell>
                                        <TableCell align='left'>{row.ownerName}</TableCell>
                                        <TableCell align='left'>{row.stars}</TableCell>
                                        <TableCell align='left'>
                                            <Link rel="noopener" href={row.url}>{row.url}</Link>
                                        </TableCell>
                                        <TableCell align='left'>{row.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            rowsPerPageOptions={[30]}
                            page={state.shown.search.page}
                            rowsPerPage={state.shown.search.pageSize}
                            count={state.shown.search.count || 0}
                            onChangePage={handlePageChange(dispatch, state)}
                        />
                    </>
                    : <>
                        <Skeleton variant="rect" height={50} />
                        <br />
                        <Skeleton variant="rect" height={800} />
                    </>
            }
        </TableContainer>
    )
}
