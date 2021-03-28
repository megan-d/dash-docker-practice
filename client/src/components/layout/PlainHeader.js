import React, { useContext, Fragment } from 'react';
import clsx from 'clsx';
import { Link, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { AuthContext } from '../../context/auth/AuthContext';

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
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
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
  styledbutton: {
    color: '#f3f3f3',
    '&:hover': {
      color: '#f8961e',
    },
  },
  styledbuttonMobile: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

const PlainHeader = (props) => {
  const classes = useStyles();

  const { isAuthenticated, logoutUser, isLoading, login } = useContext(
    AuthContext,
  );

  const loginDemo = async (e) => {
    e.preventDefault();
    const demo = {
      email: 'jamie@demo.com',
      password: '11111111',
    };
    await login(demo);
    props.history.push('/dashboard');
  };

  return (
    <div className={classes.root}>
      <AppBar position='absolute' className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
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

          {!isLoading && (
            <Fragment>
              {isAuthenticated ? (
                <Fragment>
                  <StyledNavLink
                    className={classes.styledbutton}
                    color='inherit'
                    to='/dashboard'
                  >
                    My Dashboard
                  </StyledNavLink>
                  <StyledNavLink
                    className={classes.styledbuttonMobile}
                    color='inherit'
                    to='/profiles'
                  >
                    Developers
                  </StyledNavLink>
                  <Button
                    className={classes.styledbutton}
                    color='inherit'
                    onClick={logoutUser}
                  >
                    Logout
                  </Button>
                </Fragment>
              ) : (
                <Fragment>
                  <StyledNavLink className={classes.styledbutton} to='/login'>
                    Login
                  </StyledNavLink>
                  <StyledNavLink
                    className={classes.styledbutton}
                    to='/register'
                  >
                    Register
                  </StyledNavLink>
                  <Button
                    className={classes.styledbutton}
                    onClick={(e) => loginDemo(e)}
                  >
                    Demo
                  </Button>
                </Fragment>
              )}
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(PlainHeader);
