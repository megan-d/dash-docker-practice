import React, { useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../context/auth/AuthContext';
import Container from '@material-ui/core/Container';
import PlainHeader from '../components/layout/PlainHeader';
import Footer from './layout/Footer';
import laptop from '../assets/images/laptop.jpg';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '97vh',
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    textAlign: 'center',
    margin: '0 auto',
  },
  heroTitle: {
    width: '100%',
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    minWidth: '70%',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    color: '#333333',
    background: '#fafafa',
  },
  content: {
    flexGrow: 1,
    minHeight: '97vh',
    overflow: 'auto',
    position: 'relative',
    backgroundImage: `url(${laptop})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'bottom',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}));

export default function Landing(props) {
  const classes = useStyles();

  const { login, loadUser, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    loadUser();
  }, [isAuthenticated]);

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
    <React.Fragment>
      <CssBaseline />
      <PlainHeader />
      <main className={classes.content}>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth='sm'>
            <Typography
              component='h1'
              className={classes.HeroTitle}
              variant='h4'
              align='center'
              gutterBottom
              style={{ color: '#204051' }}
            >
              <span
                style={{
                  color: '#90be6d',
                  fontWeight: 700,
                  fontSize: '60px',
                  fontFamily: 'caveat, cursive',
                }}
              >
                {`Manage`}
              </span>
              <span
                style={{
                  color: '#372622',
                  fontSize: '60px',
                  fontFamily: 'caveat, cursive',
                }}
              >{` - `}</span>
              <span
                style={{
                  color: '#f9c74f',
                  fontWeight: 700,
                  fontSize: '60px',
                  fontFamily: 'caveat, cursive',
                }}
              >
                {`Track`}
              </span>
              <span
                style={{
                  color: '#372622',
                  fontSize: '60px',
                  fontFamily: 'caveat, cursive',
                }}
              >{` - `}</span>
              <span
                style={{
                  color: '#f8961e',
                  fontWeight: 700,
                  fontSize: '60px',
                  fontFamily: 'caveat, cursive',
                }}
              >
                Collaborate
              </span>
            </Typography>
            <Typography
              paragraph
              style={{
                color: '#333333',
                fontSize: '17px',
                width: '75%',
                margin: '0 auto',
              }}
            >
              Project management and issue tracking along with a community of
              developers to collaborate with
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify='center'>
                <Grid item>
                  <Button
                    variant='contained'
                    style={{ backgroundColor: '#43aa8b', color: '#f3f3f3' }}
                    onClick={(e) => loginDemo(e)}
                  >
                    Demo Now
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant='contained'
                    style={{ color: '#f3f3f3', backgroundColor: '#577590' }}
                    href='/register'
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        {/*  */}
      </main>
      <Footer />
    </React.Fragment>
  );
}
