import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { AuthContext } from '../../context/auth/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoading ? (
          <Spinner />
        ) : isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to='/' />
        )
      }
    />
  );
};

export default PrivateRoute;