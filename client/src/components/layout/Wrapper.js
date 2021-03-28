import React, { useEffect, useContext, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import SideDrawer from './sidedrawer/SideDrawer';
import MobileSideDrawer from './sidedrawer/MobileSideDrawer';
import DashboardHeader from './DashboardHeader';
import MobileDashboardHeader from './MobileDashboardHeader';
import Footer from './Footer';
import { AuthContext } from '../../context/auth/AuthContext';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const drawerWidth = 240;

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
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    minHeight: '93vh',
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

export default function Wrapper(props) {
  const matches = useMediaQuery('(min-width:700px)');

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleMobileDrawerOpen = () => {
    setMobileOpen(true);
  };
  const handleMobileDrawerClose = () => {
    setMobileOpen(false);
  };

  const { isAuthenticated, loadUser } = useContext(AuthContext);

  useEffect(() => {
    loadUser();
  }, [isAuthenticated]);

  return (
    <div className={classes.root}>
      {matches ? (
        <Fragment>
          <DashboardHeader
            open={open}
            handleDrawerOpen={handleDrawerOpen}
            location={props.location}
          />
          <SideDrawer open={open} handleDrawerClose={handleDrawerClose} />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth='lg' className={classes.container}>
              {props.children}

              <Box pt={4}></Box>
            </Container>
            <Footer />
          </main>
        </Fragment>
      ) : (
        <Fragment>
          <MobileDashboardHeader/>
          <MobileSideDrawer />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth='lg' className={classes.container}>
              {props.children}

              <Box pt={4}></Box>
            </Container>
            <Footer />
          </main>
        </Fragment>
      )}
    </div>
  );
}
