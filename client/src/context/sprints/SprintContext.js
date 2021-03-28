import React, { useContext, createContext, useReducer } from 'react';
import SprintReducer from './SprintReducer';
import { AlertContext } from '../alerts/AlertContext';
import axios from 'axios';

//This is similar to the file where you would put your actions if you're using Redux

const initialState = {
  isLoading: true,
  sprints: [],
  sprint: null,
//   project: null,
  errors: [],
};

//Initiate context
export const SprintContext = createContext(initialState);

//Create provider and set up reducer
export const SprintProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SprintReducer, initialState);

  //Consume alert context to be able to use showAlert
  const { showAlert } = useContext(AlertContext);

  //******************** */
  //Add actions that make calls to reducer
  //******************** */

  //*****GET USER'S SPRINTS ACTION************
  const getUserSprints = async () => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };
    try {
      const res = await axios.get('/api/projects/sprints/me', config);
      dispatch({
        type: 'LOAD_USER_SPRINTS_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      
      // if (errors) {
      //   //if errors, loop through them and dispatch the showAlert action from AlertContext
      //   await errors.forEach((el) => showAlert(el.msg, 'error'));
      // }
      dispatch({
        type: 'LOAD_USER_SPRINTS_FAILURE',
        payload: err.response.data.errors,
      });
    }
  };

  //*****GET SPRINT DETAILS ACTION************
  const getSprintDetails = async (id) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };
    try {
      const res = await axios.get(`/api/projects/sprints/sprint/${id}`, config);

      dispatch({
        type: 'LOAD_SPRINT_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      let errors = err.response.data.errors;
      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        await errors.forEach((el) => showAlert(el.msg, 'error'));
      }
      dispatch({
        type: 'LOAD_SPRINT_FAILURE',
        payload: err.response.data.errors,
      });
    }
  };

  //*****CREATE NEW SPRINT ACTION************
  const addSprint = async (sprint, projectId, history) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };

    //Create body variable and stringify
    const body = JSON.stringify(sprint);

    try {
      const res = await axios.post(`/api/projects/sprints/${projectId}`, body, config);
      dispatch({
        type: 'CREATE_SPRINT_SUCCESS',
        payload: res.data,
      });
      history.push(`/projects/${projectId}`);
    } catch (err) {
      let errors = err.response.data.errors;
      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((el) => showAlert(el.msg, 'error'));
      }
      dispatch({
        type: 'CREATE_SPRINT_FAILURE',
        payload: err.response.data.errors,
      });
    }
  };

  //*****UPDATE SPRINT DETAILS ACTION************
  const updateSprint = async (edits, projectId, sprintId, history) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };

    const body = JSON.stringify(edits);

    try {
      const res = await axios.put(
        `/api/projects/sprints/${projectId}/${sprintId}`,
        body,
        config,
      );
      dispatch({
        type: 'UPDATE_SPRINT_SUCCESS',
        payload: res.data,
      });
      history.push(`/sprint/${sprintId}`);
    } catch (err) {
      let errors = err.response.data.errors;
      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((el) => showAlert(el.msg, 'error'));
      }
      dispatch({
        type: 'UPDATE_SPRINT_FAILURE',
        payload: err.response.data.errors,
      });
    }
  };



  //*****ADD SPRINT COMMENT ACTION************
  const addSprintComment = async (comment, sprintId, history) => {
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
        `/api/projects/sprints/comment/${sprintId}`,
        body,
        config,
      );
      // dispatch({
      //   type: 'ADD_COMMENT_SUCCESS',
      //   payload: res.data,
      // });
      history.push(`/sprint/${sprintId}`);
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

  //*******CLEAR SPRINT ACTION**********
  //Clear the sprint so the previously loaded sprint doesn't flash first
  const clearSprint = async () => {
    dispatch({
      type: 'CLEAR_SPRINT',
    });
  };

  //*******CLEAR SPRINTS ACTION**********
  //Clear the sprint so the previously loaded sprint doesn't flash first
  const clearSprints = async () => {
    dispatch({
      type: 'CLEAR_SPRINTS',
    });
  };

  //*******DELETE SPRINT ACTION**********
  const deleteSprint = async (projectId, sprintId, history) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };
    try {
      await axios.delete(
        `/api/projects/sprints/${projectId}/${sprintId}`,
        config,
      );

      dispatch({
        type: 'SPRINT_DELETED',
      });
      history.push(`/projects/${projectId}`);
    } catch (err) {
      let errors = err.response.data.errors;
      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((el) => showAlert(el.msg, 'error'));
      }
    }
  };

  //*****REMOVE TICKET FROM SPRINT ACTION************
const removeTicketFromSprint = async (sprintId, ticketId, history) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };
  
    try {
      const res = await axios.delete(
        `/api/projects/sprints/ticket/${sprintId}/${ticketId}`,
        config,
      );
      dispatch({
        type: 'UPDATE_SPRINT_SUCCESS',
        payload: res.data,
      });
      history.push(`/sprint/${sprintId}`);
    } catch (err) {
      let errors = err.response.data.errors;
      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((el) => showAlert(el.msg, 'error'));
      }
      dispatch({
        type: 'UPDATE_SPRINT_FAILURE',
        payload: err.response.data.errors,
      });
    }
  };

  
  //Return Sprint Provider
  return (
    <SprintContext.Provider
      value={{
        sprints: state.sprints,
        sprint: state.sprint,
        isLoading: state.isLoading,
        errors: state.errors,
        project: state.project,
        getUserSprints,
        addSprint,
        getSprintDetails,
        deleteSprint,
        clearSprint,
        clearSprints,
        addSprintComment,
        updateSprint,
        removeTicketFromSprint
      }}
    >
      {children}
    </SprintContext.Provider>
  );
};
