import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import './styles/index.css';
import GlobalStyle from './styles/GlobalStyle';
import Landing from './components/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Error from './components/views/Error';
import { AuthContext } from './context/auth/AuthContext';
import DeveloperDashboard from './components/dashboard/developer/DeveloperDashboard';
import Projects from './components/dashboard/projects/Projects';
import Project from './components/dashboard/projects/Project';
import EditProject from './components/dashboard/projects/EditProject';
import CreateProject from './components/dashboard/projects/CreateProject';
import Tickets from './components/dashboard/tickets/Tickets';
import Sprints from './components/dashboard/sprints/Sprints';
import Sprint from './components/dashboard/sprints/Sprint';
import UpdateSprint from './components/dashboard/sprints/UpdateSprint';
import SubmitTicket from './components/dashboard/tickets/SubmitTicket';
import Ticket from './components/dashboard/tickets/Ticket';
import UpdateTicket from './components/dashboard/tickets/UpdateTicket';
import CommentTicket from './components/dashboard/tickets/CommentTicket';
import Profile from './components/profile/Profile';
import MyProfile from './components/profile/MyProfile';
import CommentProfile from './components/profile/CommentProfile';
import CreateProfile from './components/profile/CreateProfile';
import UpdateProfile from './components/profile/UpdateProfile';
import CommentProject from './components/dashboard/projects/CommentProject';
import Profiles from './components/profile/Profiles';
import Forum from './components/forum/Forum';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateSprint from './components/dashboard/sprints/CreateSprint';
import CommentSprint from './components/dashboard/sprints/CommentSprint';
import DemoPage from './components/demo/DemoPage';

const App = () => {
  const { loadUser, isAuthenticated } = useContext(AuthContext);

  //run loadUser upon App component initially mounting (like component did mount - will only run once with empty array)
  useEffect(() => {
    loadUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <CssBaseline />
      <GlobalStyle />
      <div className='full-page'>
        <Switch>
          <Route path='/' component={Landing} exact />
          <Route path='/register' component={Register} exact />
          <Route path='/login' component={Login} exact />
          <Route path='/demo' component={DemoPage} exact />
          <PrivateRoute
            path='/dashboard'
            component={DeveloperDashboard}
            exact
          />
          <PrivateRoute path='/createproject' component={CreateProject} exact />
          <PrivateRoute path='/projects' component={Projects} exact />
          <PrivateRoute path='/projects/:projectid' component={Project} exact />
          <PrivateRoute
            path='/projects/:projectid/edit'
            component={EditProject}
            exact
          />
          <PrivateRoute
            path='/projects/submitticket/:projectid'
            component={SubmitTicket}
            exact
          />
          <PrivateRoute
            path='/projects/tickets/updateticket/:ticketid'
            component={UpdateTicket}
            exact
          />
          <PrivateRoute
            path='/projects/tickets/comment/:ticketid'
            component={CommentTicket}
            exact
          />
          <PrivateRoute
            path='/projects/comment/:projectid'
            component={CommentProject}
            exact
          />
          <PrivateRoute path='/tickets' component={Tickets} exact />
          <PrivateRoute path='/ticket/:ticketid' component={Ticket} exact />
          <PrivateRoute path='/sprints' component={Sprints} exact />
          <PrivateRoute path='/sprint/:sprintid' component={Sprint} exact />
          <PrivateRoute
            path='/projects/sprints/comment/:sprintid'
            component={CommentSprint}
            exact
          />
          <PrivateRoute
            path='/projects/createsprint/:projectid'
            component={CreateSprint}
            exact
          />
          <PrivateRoute
            path='/projects/sprints/updatesprint/:sprintid'
            component={UpdateSprint}
            exact
          />
          <PrivateRoute path='/profiles' component={Profiles} exact />
          <PrivateRoute path='/createprofile' component={CreateProfile} exact />
          <PrivateRoute
            path='/profiles/updateprofile/:userid'
            component={UpdateProfile}
            exact
          />
          <PrivateRoute path='/profiles/:userid' component={Profile} exact />
          <PrivateRoute path='/profiles/me/:userid' component={MyProfile} exact />
          {/* <PrivateRoute path='/profiles/me/:userid' component={MyProfile} exact /> */}
          <PrivateRoute
            path='/profiles/comment/:userid'
            component={CommentProfile}
            exact
          />
          <PrivateRoute path='/forum' component={Forum} exact />
          <Route path='' component={Error} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
