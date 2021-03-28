import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PersonIcon from '@material-ui/icons/Person';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Divider from '@material-ui/core/Divider';
import styled from 'styled-components';
import { AuthContext } from '../../../context/auth/AuthContext';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #333333;
`;

const DrawerListItems = ({ sidedrawerClick }) => {
  const { logoutUser, user } = useContext(AuthContext);

  return (
    <Fragment>
      <div className='main-list-items'>
        {/* If role is developer or manager, show developer/manager sidedrawer list */}

        <StyledLink to='/dashboard'>
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon style={{ color: '#43aa8b' }} />
            </ListItemIcon>
            <ListItemText primary='Dashboard' />
          </ListItem>
        </StyledLink>

        <StyledLink to='/projects'>
          <ListItem button>
            <ListItemIcon>
              <AssignmentIcon style={{ color: '#43aa8b' }} />
            </ListItemIcon>
            <ListItemText primary='Projects' />
          </ListItem>
        </StyledLink>

        <StyledLink to='/tickets'>
          <ListItem button>
            <ListItemIcon>
              <ConfirmationNumberIcon style={{ color: '#43aa8b' }} />
            </ListItemIcon>
            <ListItemText primary='My Assigned Tickets' />
          </ListItem>
        </StyledLink>

        <StyledLink to='/sprints'>
          <ListItem button>
            <ListItemIcon>
              <GroupWorkIcon style={{ color: '#43aa8b' }} />
            </ListItemIcon>
            <ListItemText primary='My Sprints' />
          </ListItem>
        </StyledLink>

        <StyledLink to='/profiles'>
          <ListItem button>
            <ListItemIcon>
              <SupervisedUserCircleIcon style={{ color: '#43aa8b' }} />
            </ListItemIcon>
            <ListItemText primary='Developers' />
          </ListItem>
        </StyledLink>
      </div>

      <Divider />

      <div className='secondary-list-items'>
        {/* <StyledLink to='/submit'>
    <ListItem button>
    <ListItemIcon>
    <AddCircleIcon />
    </ListItemIcon>
    <ListItemText primary='Submit Ticket' />
    </ListItem>
    </StyledLink>  */}

        <StyledLink to={`/profiles/me/${user._id}`}>
          <ListItem button>
            <ListItemIcon>
              <PersonIcon style={{ color: '#43aa8b' }} />
            </ListItemIcon>
            <ListItemText primary='My Profile' />
          </ListItem>
        </StyledLink>

        <StyledLink to='/' onClick={logoutUser}>
          <ListItem button>
            <ListItemIcon>
              <ExitToAppIcon style={{ color: '#43aa8b' }} />
            </ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItem>
        </StyledLink>

        {/* If role is admin, show admin sidedrawer list */}
      </div>
    </Fragment>
  );
};

export default DrawerListItems;
