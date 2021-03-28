import React, { Fragment, useContext } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Spinner from '../../layout/Spinner';
import { AuthContext } from '../../../context/auth/AuthContext';
import Wrapper from '../../layout/Wrapper';
import TicketStatusPie from '../charts/TicketStatusPie';
import TicketsByProjectBar from '../charts/TicketsByProjectBar';
import TicketPriorityPie from '../charts/TicketPriorityPie';
import PendingTicketsTable from '../charts/PendingTicketsTable';
import CompletedTicketsTable from '../charts/CompletedTicketsTable';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fixedHeight: {
    minHeight: 340,
    height: 340,
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      minWidth: '300px',
    },
  },
   table: {
     [theme.breakpoints.down('sm')]: {
      minWidth: '300px',
    }},
  root: {
    display: 'flex',
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
}));

export default function DeveloperDashboard(props) {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const { isLoading, user } = useContext(
    AuthContext,
  );

  return (
    <Wrapper>
      {isLoading && user === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <h2 className='page-heading'>My Dashboard</h2>
          <hr className='hr' />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <TicketPriorityPie />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <TicketStatusPie />
              </Paper>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <Paper className={fixedHeightPaper}>
                <TicketsByProjectBar />
              </Paper>
            </Grid>

            <Grid item xs={12} md={12} lg={6}>
              <Paper className={classes.paper, classes.table}>
                <PendingTicketsTable />
              </Paper>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <Paper className={classes.paper, classes.table}>
                <CompletedTicketsTable />
              </Paper>
            </Grid>
          </Grid>
        </Fragment>
      )}
    </Wrapper>
  );
}
