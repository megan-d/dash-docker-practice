import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Spinner from './Spinner';
// import { deepOrange, deepPurple } from '@material-ui/core/colors';
import { AuthContext } from '../../context/auth/AuthContext';

const colors = ['orange', 'red', 'green', 'blue', 'yellow', 'purple', 'black', 'white'];

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function AvatarIcon(props) {
  const classes = useStyles();

  return (
    <Avatar
      className={classes.root}
      style={{
        height: '40px',
        width: '40px',
        color: '#e5e0db',
        backgroundColor: colors[`${props.classColor}`],
      }}
    >
      {props.developer.firstName.charAt(0).toUpperCase()}
      {props.developer.lastName.charAt(0).toUpperCase()}
    </Avatar>
  )
}
