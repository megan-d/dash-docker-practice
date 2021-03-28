import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Spinner from '../../layout/Spinner';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

const colors = [
    // '#F94144',
    '#F3722C',
    '#F8961E',
    '#F9C74F',
    '#90BE6D',
    '#43AA8B',
    '#577590',
    'grey',
  ];

export default function Comment({comment, index, isLoading}) {
  const classes = useStyles();

  return (
    isLoading ? <Spinner /> : (
      
        <List className={classes.root}>
      <ListItem alignItems='flex-start'>
        <ListItemAvatar>
          <Avatar
            className={classes.root}
            style={{
              height: '40px',
              width: '40px',
              color: '#fafafa',
              backgroundColor: colors[index % colors.length],
            }}
          >
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={comment.title}
          secondary={
            <React.Fragment>
              <Typography
                component='span'
                variant='body2'
                className={classes.inline}
                color='textPrimary'
              >
                {comment.user ? (comment.user.username) : ('')}
              </Typography>
              {` — ${comment.comment}`}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant='inset' component='li' />
    </List>
    )
  );
}
