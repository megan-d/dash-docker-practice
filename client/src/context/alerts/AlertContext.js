import React, { createContext, useReducer } from 'react';
import AlertReducer from './AlertReducer';
import { v4 as uuidv4 } from 'uuid';

//This is similar to the file where you would put your actions if you're using Redux

const initialState = [];

//Initiate context
export const AlertContext = createContext(initialState);

//Create provider and set up reducer
export const AlertProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AlertReducer, initialState);

  //Add actions that make calls to reducer

  //*****ALERT ACTION************
  const showAlert = (msg, alertType) => {
    const id = uuidv4();
    dispatch({
      type: 'SHOW_ALERT',
      payload: { msg, alertType, id },
    });

    setTimeout(
      () =>
        dispatch({
          type: 'REMOVE_ALERT',
          payload: id,
        }),
      3000,
    );
  };

  //Return Alert Provider
  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        showAlert
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
