import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PopMenu from '../layout/PopMenu';
import styled from 'styled-components';

const drawerWidth = 240;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #f3f3f3;
  &:hover {
    color: #f8961e; 
  }
`;

const StyledNavLink = styled(Link)`
  text-decoration: none;
  color: #f3f3f3;
  text-transform: uppercase;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 8px;
  &:hover {
    color: #f8961e; 
  }
`;

const useStyles = makeStyles((theme) => ({
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
    background: '#204051',
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
    color: 'white',
    '&:hover': {
      backgroundColor: '#577590',
  }
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  rightHeader: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
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
}));

const DashboardHeader = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar
        position='absolute'
        className={clsx(classes.appBar, props.open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={() => props.handleDrawerOpen()}
            className={clsx(
              classes.menuButton,
              props.open && classes.menuButtonHidden,
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component='h1'
            variant='h6'
            color='inherit'
            noWrap
            className={classes.title}
          >
            <StyledLink
              to='/'
              style={{ fontFamily: 'Caveat, cursive', fontSize: '30px' }}
            >
              --DASH-->
            </StyledLink>
          </Typography>
          <div className={classes.rightHeader}>
          <StyledNavLink to='/dashboard' >
            Dashboard
          </StyledNavLink>
          <StyledNavLink to='/profiles' >
            Developers
          </StyledNavLink>
          <PopMenu />
          </div>
          
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default DashboardHeader;
