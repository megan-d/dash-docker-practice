import React, { useContext, createContext, useReducer } from 'react';
import AuthReducer from './AuthReducer';
import { Redirect } from 'react-router-dom';
import { AlertContext } from '../alerts/AlertContext';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

//This is similar to the file where you would put your actions if you're using Redux

const initialState = {
  token: localStorage.getItem('token'),
  isLoading: true,
  user: null,
  isAuthenticated: false,
  errors: null,
};

//Initiate context
export const AuthContext = createContext(initialState);

//Create provider and set up reducer
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  //Consume alert context to be able to use showAlert
  const { showAlert } = useContext(AlertContext);

  //Add actions that make calls to reducer

  //*****REGISTER ACTION************
  const register = async (user) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    //Create body and stringify user object
    const data = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
      role: user.role,
    };
    const body = JSON.stringify(data);
    try {
      const res = await axios.post('/api/users', body, config);
      const token = res.data.token;
      if (token) {
        localStorage.setItem('token', token);
      }

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      let errors = err.response.data.errors;
      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((error) => showAlert(error.msg, 'error'));
      }
      dispatch({
        type: 'REGISTER_FAILURE',
      });
    }
  };

  //*****LOGIN ACTION************
  const login = async (user) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    //Create body and stringify user object
    const data = {
      email: user.email,
      password: user.password,
    };
    const body = JSON.stringify(data);
    try {
      const res = await axios.post('/api/auth', body, config);
      const token = res.data.token;

      if (token) {
        localStorage.setItem('token', token);
      }
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((error) => showAlert(error.msg, 'error'));
      }
      dispatch({
        type: 'LOGIN_FAILURE',
      });
    }
  };

  //*****LOAD USER ACTION************
  const loadUser = async (user) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };
    try {
      const res = await axios.get('/api/users', config);
      dispatch({
        type: 'LOAD_USER_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      let errors = err.response.data.errors;
      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((error) => showAlert(error.msg, 'error'));
      }
      dispatch({
        type: 'LOAD_USER_FAILURE',
      });
    }
  };

  //*****LOGOUT USER ACTION************
  const logoutUser = async () => {
    dispatch({
      type: 'LOGOUT',
    });
    return <Redirect to='/' />;
    //TODO: Need to set up action to clear user profile if I set up profile as separate state
  };

  //*****DELETE USER ACTION************
  const deleteUser = async (history) => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
    };

    try {
      await axios.delete(`/api/users`, config);
      dispatch({
        type: 'USER_DELETED',
      });
      history.push('/');
    } catch (err) {
      let errors = err.response.data.errors;
      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((el) => showAlert(el.msg, 'error'));
      }
    }
  };

  //*****REGISTER DEMO USER ACTION************
  const registerDemo = async () => {
    //Create config with headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    let fullId = uuidv4();
    let id = fullId.substring(0, 5);
    const demoUser = {
      firstName: 'Steven',
      lastName: 'Demo',
      username: `Demo${id}`,
      email: `${id}@demo.com`,
      password: '12345678',
      confirmPassword: '12345678',
      role: 'manager',
    };
    
    
    const body = JSON.stringify(demoUser);
    try {
      const res = await axios.post('/api/users', body, config);
      const token = res.data.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      let errors = err.response.data.errors;
      if (errors) {
        //if errors, loop through them and dispatch the showAlert action from AlertContext
        errors.forEach((error) => showAlert(error.msg, 'error'));
      }
      dispatch({
        type: 'REGISTER_FAILURE',
      });
    }
  };

  //Return Auth Provider
  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isLoading: state.isLoading,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        errors: state.errors,
        register,
        login,
        loadUser,
        logoutUser,
        deleteUser,
        registerDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
