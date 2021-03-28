import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 250,
    width: 160,
    margin: '5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: '#333333',
    minHeight: 126
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 17,
    fontWeight: 500,
    fontStyle: 'italic'
  },
  pos: {
    marginBottom: 12,
  },
});

export default function ProjectCard({name, description, id, color}) {
  const classes = useStyles();

  let history = useHistory();

  return (
    <Card className={classes.root} style={{border: `2px solid ${color}`}}>
      <CardContent>
        <Typography  className={classes.title}>
          {name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={async() => {
          history.push(`/projects/${id}`)}} style={{color: '#333333', fontSize: '12px'}}>View Details</Button>
      </CardActions>
    </Card>
  );
}