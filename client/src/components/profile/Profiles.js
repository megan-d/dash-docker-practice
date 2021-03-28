import React, { useEffect, useContext, useState, Fragment } from 'react';
import { ProfileContext } from '../../context/profiles/ProfileContext';
import Wrapper from '../layout/Wrapper';
import Spinner from '../layout/Spinner';
import ProfileCard from './ProfileCard';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';

const StyledCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    border: '1px solid #203a43',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginBottom: 10,
    width: '50%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: '50%',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      '&:focus': {
        width: '100%',
        outline: '2px solid #204051',
        borderRadius: theme.shape.borderRadius,
      },
    },
  },
}));

const Profiles = (props) => {
  const classes = useStyles();

  const {
    profiles,
    isLoading,
    getProfiles,
    clearProfiles,
  } = useContext(ProfileContext);

  const [searchTerm, updateSearch] = useState('');

  // Function to update state on change using updateFormData
  const onChange = (e) => updateSearch(e.target.value);

  useEffect(() => {
    getProfiles();
    return () => clearProfiles();
  }, []);

  const colors = [
    // '#F94144',
    '#203a43',
    '#F3722C',
    '#F8961E',
    '#F9C74F',
    '#90BE6D',
    '#43AA8B',
    '#577590',
    'grey',
  ];

  // '#F8961E',
  // '#F9C74F',
  // '#90BE6D',
  // '#43AA8B',
  // '#577590',
  // '#203a43',

  //Filter through which profiles should be shown based on searchTerm state
  const filteredProfiles = profiles.filter((el, index) => {
    let skills = el.skills.filter((skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    let skill;
    for (skill of skills) {
      return skill;
    }
    return (
      el.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill
    );
  });

  //TODO: Need to fix loading so there aren't two spinners. One is coming from PrivateRoute component
  return (
    <Wrapper>
      <h2 className='page-heading'>Developer Profiles</h2>
      <p>
        View developer profiles to learn more about the community and find
        developers to collaborate with
      </p>

      <hr className='hr'></hr>
      {isLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              style={{ minWidth: '100%' }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={onChange}
            />
          </div>
          <StyledCards>
            {filteredProfiles.map((el, index) => {
              return (
                <ProfileCard
                  key={el._id}
                  firstName={el.user.firstName}
                  lastName={el.user.lastName}
                  username={el.user.username}
                  skills={el.skills}
                  id={el.user._id}
                  color={colors[index % colors.length]}
                />
              );
            })}
          </StyledCards>
        </Fragment>
      )}
    </Wrapper>
  );
};

export default Profiles;
