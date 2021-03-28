import React, { Fragment, useContext } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chart from '../charts/Chart';
import Deposits from '../charts/Deposits';
import Table from '../charts/Table';
import Container from '@material-ui/core/Container';
import SideDrawer from '../../layout/sidedrawer/SideDrawer';
import Spinner from '../../layout/Spinner';
import DashboardHeader from '../../layout/DashboardHeader';
import { AuthContext } from '../../../context/auth/AuthContext';
import Wrapper from '../../layout/Wrapper';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fixedHeight: {
    height: 240,
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: '#ad3968',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
}));

export default function DeveloperDashboard(props) {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const { isLoading, user } = useContext(AuthContext);

  return (
    <Wrapper>
      {isLoading && user === null ? (
        <Spinner />
        
      ) : (
        <Fragment>
          <h2>Admin Dashboard</h2>
          <hr />
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart />
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits />
              </Paper>
            </Grid>
            {/* Recent Orders */}
            {/* Table */}
            <Grid item xs={12} lg={6}>
              <Paper className={classes.paper}>
                <Table />
              </Paper>
            </Grid>
            <Grid item md={12} lg={6}>
              <Paper className={classes.paper}>
                <Table />
              </Paper>
            </Grid>
          </Grid>
        </Fragment>
      )}
    </Wrapper>
  );
}
