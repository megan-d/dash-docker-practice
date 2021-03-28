import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ProjectContext } from '../../../context/projects/ProjectContext';
import Spinner from '../../layout/Spinner';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function ListItemLink(props) {
  return (
    <Link
      component='a'
      {...props}
      style={{ textDecoration: 'none', color: 'grey' }}
    />
  );
}

export default function DevelopersList(props) {
  const classes = useStyles();

  const { project, isLoading } = useContext(
    ProjectContext,
  );

  return isLoading ? (
    <Spinner />
  ) : !isLoading && project.developers.length > 0 ? (
    <div className={classes.root}>
      <List component='nav' aria-label='main mailbox folders'>
        <h4>Developers on project:</h4>
        {project.developers.map((el, index) => (
          // <li key={el._id}>{el.username}</li>
          <ListItem button>
            <ListItemIcon>
              <Avatar
                className={classes.root}
                style={{
                  height: '40px',
                  width: '40px',
                  color: '#e5e0db',
                //   backgroundColor: colors[index],
                }}
              >
                {el.firstName.charAt(0).toUpperCase()}
                {el.lastName.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemIcon>
            <ListItemLink to={'/projects'}>
              <ListItemText primary={el.username} />
            </ListItemLink>
          </ListItem>
        ))}
      </List>
    </div>
  ) : ('');
}
