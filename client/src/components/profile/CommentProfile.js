import React, { useState, useContext, useEffect, Fragment } from 'react';
import Wrapper from '../layout/Wrapper';
import Spinner from '../layout/Spinner';
import {
  StyledRedLink,
  StyledBlueButton,
} from '../../styles/styledComponents/StyledLinks';
import { makeStyles } from '@material-ui/core/styles';
import AlertBanner from '../layout/AlertBanner';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { ProfileContext } from '../../context/profiles/ProfileContext';

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

const CommentProfile = (props) => {
  const classes = useStyles();

  const [formData, updateFormData] = useState({
    comment: '',
    title: '',
  });

  //Pull out variables from formData and userData
  const { comment, title } = formData;

  const { profile, getProfileById, addComment, clearProfile } = useContext(ProfileContext);

  useEffect(() => {
    getProfileById(props.match.params.userid);
    return () => {
      clearProfile();
    };
  }, []);

  // Function to update state on change using updateFormData
  const onChange = (e) =>
    updateFormData({ ...formData, [e.target.name]: e.target.value });

  //Function to send data that's in formData to database endpoint when submit is clicked
  const onSubmit = async (e) => {
    e.preventDefault();
    const newComment = {
      comment: comment,
      title: title,
    };
    //call add project action
    await addComment(newComment, profile.user._id, profile._id, props.history);
  };

  return (
    <Wrapper>
      {!profile ? (
        <Spinner />
      ) : (
        <Fragment>
          <h2 className='page-heading'>
            Comment on {profile.user.username}'s Profile
          </h2>
          <p>Leave a comment or request to collaborate</p>
          <hr className='hr'></hr>

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
                    name='title'
                    variant='outlined'
                    required
                    fullWidth
                    id='title'
                    label='Comment Title'
                    autoFocus
                    value={title}
                    onChange={(e) => onChange(e)}
                    margin='normal'
                  />
                  <TextField
                    name='comment'
                    variant='outlined'
                    required
                    fullWidth
                    id='comment'
                    label='Comment'
                    value={comment}
                    onChange={(e) => onChange(e)}
                    multiline
                    rows={6}
                    margin='normal'
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
                    to={`/profiles/${profile.user._id}`}
                    className={classes.buttons}
                  >
                    CANCEL
                  </StyledRedLink>
                </form>
              </div>
            </Grid>
          </Grid>
        </Fragment>
      )}
    </Wrapper>
  );
};

export default CommentProfile;
