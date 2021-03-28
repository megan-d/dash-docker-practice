import React, { useState, useContext, useEffect } from 'react';
import Wrapper from '../layout/Wrapper';
import Spinner from '../layout/Spinner';
import { makeStyles } from '@material-ui/core/styles';
import {
  StyledRedLink,
  StyledBlueButton
} from '../../styles/styledComponents/StyledLinks';
import AlertBanner from '../layout/AlertBanner';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { ProfileContext } from '../../context/profiles/ProfileContext';
import { AuthContext } from '../../context/auth/AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#204051',
    },
    '& label.Mui-focused': {
      color: '#204051',
    },
  },
  paper: {
    margin: theme.spacing(4, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  buttons: {
    marginRight: '10px',
    marginTop: '20px',
  },
}));

const UpdateProfile = ({ history, match }) => {
  const classes = useStyles();

  //Load user profile on mount
  useEffect(() => {
    getProfileById(match.params.userid);
    return () => {
      clearProfile();
    };
  }, []);

  const [formData, updateFormData] = useState({
    bio: '',
    skills: '',
  });

  const { updateProfile, profile, getProfileById, clearProfile } = useContext(
    ProfileContext,
  );
  const { user } = useContext(AuthContext);

  //Pull out variables from formData and userData
  const { bio, skills } = formData;

  // Function to update state on change using updateFormData
  const onChange = (e) =>
    updateFormData({ ...formData, [e.target.name]: e.target.value });

  //Function to send data that's in formData to database endpoint when submit is clicked
  const onSubmit = async (e) => {
    e.preventDefault();
    const edits = {
      bio: bio,
      skills: skills,
    };
    //call add project action
    await updateProfile(edits, user._id, history);
    history.push(`/profiles/${user._id}`);
  };

  return (
    <Wrapper>
      <h2 className='page-heading'>Update Your Profile</h2>
      <hr className='hr'></hr>
      {!profile ? (
        <Spinner />
      ) : (
        <Grid container component='main' className={classes.root}>
          <Grid
            item
            xs={12}
            sm={8}
            md={8}
            component={Paper}
            elevation={6}
            square
          >
            <div className={classes.paper}>
              <form
                className={classes.form}
                action=''
                onSubmit={(e) => onSubmit(e)}
              >
                <TextField
                  autoComplete='bio'
                  placeholder={profile.bio}
                  name='bio'
                  variant='outlined'
                  autoFocus
                  fullWidth
                  multiline
                  rows={6}
                  id='bio'
                  label='Bio'
                  helperText='Please provide a brief description about yourself as a developer.'
                  value={bio}
                  onChange={(e) => onChange(e)}
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  variant='outlined'
                  placeholder={profile.skills.join()}
                  fullWidth
                  name='skills'
                  label='Technologies'
                  helperText='Enter any technologies you would like to add to your existing profile.'
                  id='skills'
                  value={skills}
                  onChange={(e) => onChange(e)}
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <AlertBanner />
                <StyledBlueButton
                  type='submit'
                  className={classes.buttons}
                  onClick={(e) => onSubmit(e)}
                >
                  SUBMIT
                </StyledBlueButton>
                <StyledRedLink
                  to={`/profiles/${user._id}`}
                  className={classes.buttons}
                >
                  CANCEL
                </StyledRedLink>
              </form>
            </div>
          </Grid>
        </Grid>
      )}
    </Wrapper>
  );
};

export default UpdateProfile;
