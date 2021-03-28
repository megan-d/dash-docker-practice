import React, { useContext, createContext, useReducer } from 'react';
import ProfileReducer from './ProfileReducer';
import { AlertContext } from '../alerts/AlertContext';
import axios from 'axios';

//This is similar to the file where you would put your actions if you're using Redux

const initialState = {
  isLoading: true,
  profiles: [],
  profile: null,
  errors: null,
};

//Initiate context
export const ProfileContext = createContext(initialState);

//Create provider and set up reducer
export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ProfileReducer, initialState);

  //Consume alert context to be able to use showAlert
  const { showAlert } = useContext(AlertContext);

  //******************** */
  //Add actions that make calls to reducer
  //******************** */

  //*****GET ALL DEVELOPER PROFILES ACTION************
  const getProfiles = async () => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };
    try {
      const res = await axios.get('/api/profiles', config);
      dispatch({
        type: 'LOAD_PROFILES_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      let errors = err.response.data.errors;

      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((error) => showAlert(error.msg, 'error'));
      }
      dispatch({
        type: 'LOAD_PROFILES_FAILURE',
        payload: err.response.data.errors,
      });
    }
  };

  //*****GET CURRENT USER'S PROFILE ACTION************
  const getCurrentUserProfile = async () => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };
    try {
      const res = await axios.get('/api/profiles/me', config);
      dispatch({
        type: 'LOAD_USER_PROFILE_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      let errors = err.response.data.errors;

      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext. Don't include the no profile error (since this should never be reached.)
        const filteredErrors = errors.filter(el => el.msg !== 'An existing profile could not be found. Please create a profile.')
        filteredErrors.forEach((error) => showAlert(error.msg, 'error'));
      }
      dispatch({
        type: 'LOAD_USER_PROFILE_FAILURE',
        payload: err.response.data.errors,
      });
    }
  };

  //*****GET PROFILE BY USER ID ACTION************
  const getProfileById = async (userId) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };
    try {
      const res = await axios.get(`/api/profiles/user/${userId}`, config);

      dispatch({
        type: 'LOAD_USER_PROFILE_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      let errors = err.response.data.errors;
      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((el) => showAlert(el.msg, 'error'));
      }
      dispatch({
        type: 'LOAD_USER_PROFILE_FAILURE',
        payload: err.response.data.errors,
      });
    }
  };

  //*****CREATE NEW PROFILE ACTION************
  const createProfile = async (profile, history) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };

    //Create body variable and stringify
    const body = JSON.stringify(profile);

    try {
      const res = await axios.post('/api/profiles', body, config);
      dispatch({
        type: 'CREATE_USER_PROFILE_SUCCESS',
        payload: res.data,
      });
      
      history.push(`/dashboard`);
    } catch (err) {
      let errors = err.response.data.errors;

      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((el) => showAlert(el.msg, 'error'));
      }

      dispatch({
        type: 'CREATE_USER_PROFILE_FAILURE',
        payload: err.response.data.errors,
      });
    }
  };

  //*****UPDATE PROFILE ACTION************
  const updateProfile = async (edits, userId, history) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };

    //Create body variable and stringify
    const body = JSON.stringify(edits);

    try {
      const res = await axios.put(`/api/profiles/${userId}`, body, config);
      dispatch({
        type: 'UPDATE_USER_PROFILE_SUCCESS',
        payload: res.data,
      });
      // history.push(`/profiles/${userId}`);
    } catch (err) {
      let errors = err.response.data.errors;

      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((el) => showAlert(el.msg, 'error'));
      }

      dispatch({
        type: 'UPDATE_USER_PROFILE_FAILURE',
        payload: err.response.data.errors,
      });
    }
  };

  //*****ADD PROFILE COMMENT ACTION************
  const addComment = async (comment, userId, profileId, history) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };

    const body = JSON.stringify(comment);

    try {
      await axios.post(
        `/api/profiles/comment/${profileId}`,
        body,
        config,
      );
      // dispatch({
      //   type: 'ADD_COMMENT_SUCCESS',
      //   payload: res.data,
      // });
      history.push(`/profiles/${userId}`);
    } catch (err) {
      let errors = err.response.data.errors;
      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((el) => showAlert(el.msg, 'error'));
      }
      // dispatch({
      //   type: 'ADD_COMMENT_FAILURE',
      //   payload: err.response.data.errors
      // });
    }
  };

  //*******CLEAR PROFILE ACTION**********
  //Clear the project so the previously loaded profject doesn't flash first
  const clearProfile = async () => {
    dispatch({
      type: 'CLEAR_USER_PROFILE',
    });
  };

  //*******CLEAR PROFILES ACTION**********
  //Clear the projects
  const clearProfiles = async () => {
    dispatch({
      type: 'CLEAR_PROFILES',
    });
  };

  //*****DELETE PROFILE ACTION************
  const deleteProfile = async (id, history) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };

    try {
      await axios.delete(`/api/profiles/${id}`, config);
      dispatch({
        type: 'PROFILE_DELETED',
      });
      history.push(`/profiles/${id}`);
    } catch (err) {
      let errors = err.response.data.errors;
      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((el) => showAlert(el.msg, 'error'));
      }
    }
  };

  //*****CREATE DEMO PROFILE ACTION************
  const createDemoProfile = async () => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };

    const demoProfileInfo = {
      bio: 'I am an experienced full stack web developer working on a variety of personal projects. I would enjoy collaborating with other developers. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra. Aenean tortor urna, consectetur varius mauris sit amet, sodales maximus nisl. Nam dictum orci id vestibulum imperdiet.',
      skills: 'HTML, CSS, JavaScript, React, Node.js, MongoDB'
    }

    //Create body variable and stringify
    const body = JSON.stringify(demoProfileInfo);

    try {
      const res = await axios.post('/api/profiles', body, config);
      dispatch({
        type: 'CREATE_USER_PROFILE_SUCCESS',
        payload: res.data,
      });
      
      // history.push(`/dashboard`);
    } catch (err) {
      let errors = err.response.data.errors;

      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((el) => showAlert(el.msg, 'error'));
      }

      dispatch({
        type: 'CREATE_USER_PROFILE_FAILURE',
        payload: err.response.data.errors,
      });
    }
  };

  //Return Profile Provider
  return (
    <ProfileContext.Provider
      value={{
        profiles: state.profiles,
        profile: state.profile,
        isLoading: state.isLoading,
        error: state.error,
        getProfiles,
        getCurrentUserProfile,
        getProfileById,
        clearProfile,
        clearProfiles,
        createProfile,
        updateProfile,
        addComment,
        deleteProfile,
        createDemoProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
