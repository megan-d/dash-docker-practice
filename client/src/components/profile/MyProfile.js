import React, { useContext, useEffect, Fragment } from 'react';
import Wrapper from '../layout/Wrapper';
import AlertBanner from '../layout/AlertBanner';
import moment from 'moment';
import Moment from 'react-moment';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { AuthContext } from '../../context/auth/AuthContext';
import { ProfileContext } from '../../context/profiles/ProfileContext';
import {
  StyledGreyLink,
  StyledDeleteButton,
} from '../../styles/styledComponents/StyledLinks';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import PersonIcon from '@material-ui/icons/Person';
import Spinner from '../layout/Spinner';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Comment from '../dashboard/comments/Comment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  fixedHeight: {
    minHeight: 430,
    height: 430,
  },
  paper: {
    minHeight: 430,
    padding: theme.spacing(4),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    marginBottom: 20,
  },
}));

// function ListItemLink(props) {
//   return <ListItem button component='a' {...props} />;
// }

const MyProfile = (props) => {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const { user, deleteUser } = useContext(AuthContext);
  const { profile, getProfileById, isLoading, clearProfile } = useContext(
    ProfileContext,
  );

  //Load user profile on mount
  useEffect(() => {
    getProfileById(props.match.params.userid);
    return () => {
      clearProfile();
    };
  }, []);

  return (
    <Wrapper>
      <div className='flex'>
        <PersonIcon className='page-heading-icon' />
        <h2 className='page-heading'>Developer Profile</h2>
      </div>
      <hr className='hr'></hr>
      <AlertBanner />
      {(isLoading || profile === null) ? <Spinner /> : ''}

      {!isLoading && !profile ? (
        <Fragment>
          <p>Please click the button below to create a profile.</p>
          <StyledGreyLink to={'/createprofile'}>Create Profile</StyledGreyLink>
        </Fragment>
      ) : !isLoading && profile ? (
        <Fragment>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <h4 className='page-content-subheading'>Name: </h4>
                <p className='page-content'>
                  {profile.user.firstName} {profile.user.lastName}
                </p>
                <h4 className='page-content-subheading'>Username: </h4>
                <p className='page-content'>{profile.user.username}</p>
                {profile.bio && (
                  <Fragment>
                    <h4 className='page-content-subheading'>Bio:</h4>
                    <p className='page-content'>{profile.bio}</p>
                  </Fragment>
                )}

                <h4 className='page-content-subheading'>Date Joined: </h4>
                <Moment format='MM/DD/YYYY'>{moment(profile.created)}</Moment>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <h4 className='page-content-subheading'>Technical Skills:</h4>
                {profile.skills.length > 0 && !isLoading ? (
                  <List aria-label='tech items'>
                    {profile.skills.map((el, index) => (
                      <Fragment key={index}>
                        <ListItem>
                          <ListItemAvatar>
                            <CheckCircleOutlineOutlinedIcon className='list-icon' />
                          </ListItemAvatar>
                          <ListItemText
                            primary={el}
                            style={{ fontSize: '14px' }}
                          />
                        </ListItem>
                        <Divider
                          variant='inset'
                          component='li'
                          style={{ listStyle: 'none' }}
                        />
                      </Fragment>
                    ))}
                  </List>
                ) : (
                  <p>No listed skills</p>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper className={fixedHeightPaper}>
                <ul className='page-content-subheading'>Profile comments:</ul>
                {profile.comments.length === 0 && !isLoading ? (
                  <p>There are no comments for this profile</p>
                ) : profile.comments.length > 0 && !isLoading ? (
                  profile.comments.map((el, index) => (
                    // <li key={el._id}>{el.comment}</li>
                    <Comment
                      key={el._id}
                      comment={el}
                      comments={profile.comments}
                      index={index}
                      isLoading={isLoading}
                    />
                  ))
                ) : (
                  ''
                )}
              </Paper>
            </Grid>
          </Grid>

          <StyledGreyLink
            variant='contained'
            color='primary'
            to={`/profiles/comment/${user._id}`}
          >
            Comment
          </StyledGreyLink>
          {((user._id === profile.user._id || user.role === 'admin') && user._id !== '5f6505c1d6e9568222fcaa8c') && (
            <Fragment>
              <StyledGreyLink
                variant='contained'
                color='primary'
                to={`/profiles/updateprofile/${user._id}`}
                style={{ marginBottom: '20px' }}
              >
                Edit Profile
              </StyledGreyLink>
              <p>
                Select the button below to delete your profile AND account.
                Warning: This cannot be undone.{' '}
              </p>
              <StyledDeleteButton
                style={{ minWidth: '230px' }}
                variant='contained'
                color='secondary'
                startIcon={<DeleteIcon />}
                onClick={async () => deleteUser(props.history)}
              >
                Delete Profile and Account
              </StyledDeleteButton>
            </Fragment>
          )}
        </Fragment>
      ) : (
        ''
      )}
    </Wrapper>
  );
};

export default MyProfile;
