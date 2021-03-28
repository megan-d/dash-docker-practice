import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AlertBanner from '../layout/AlertBanner';
import PlainHeader from '../layout/PlainHeader';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import image from '../../assets/images/meeting.jpg';
import { AuthContext } from '../../context/auth/AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#204051',
    },
    '& label.Mui-focused': {
      color: '#204051',
    },
  },
  image: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#F8961E',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: '#204051',
    color: 'white',
    '&:hover': {
      backgroundColor: '#577590',
    },
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const [formData, updateFormData] = useState({
    email: '',
    password: '',
  });

  //Pull out variables from formData
  const { email, password } = formData;

  //Consume context
  const { isAuthenticated, login } = useContext(AuthContext);

  //Function to update state on change and put into updateFormData variable
  const onChange = (e) =>
    updateFormData({ ...formData, [e.target.name]: e.target.value });

  //Function to send data that's in formData to database endpoint when submit is clicked
  const onSubmit = async (e) => {
    e.preventDefault();
    //Create variable for user's email and password entered
    const user = {
      email: email,
      password: password,
    };
    //call register action
    await login(user);
  };

  //Redirect to dashboard if logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Grid container component='main' className={classes.root}>
      <CssBaseline />
      <PlainHeader />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon style={{ color: 'white' }} />
          </Avatar>
          <Typography component='h1' variant='h5' style={{ color: '#333333' }}>
            Login
          </Typography>
          <AlertBanner />
          <form
            className={classes.form}
            action=''
            onSubmit={(e) => onSubmit(e)}
          >
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              value={email}
              onChange={(e) => onChange(e)}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              value={password}
              onChange={(e) => onChange(e)}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  to='/register'
                  variant='body2'
                  style={{ color: '#204051' }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
