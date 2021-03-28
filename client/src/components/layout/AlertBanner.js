import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { AlertContext } from '../../context/alerts/AlertContext';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const AlertBanner = () => {
  const classes = useStyles();

  const { alerts } = useContext(AlertContext);
  
  return (
    <div className={classes.root}>
      {alerts !== null &&
        alerts.length > 0 &&
        alerts.map((el) => (
          <Alert severity={el.alertType} key={el.id}>
            {el.msg}
          </Alert>
        ))}
    </div>
  );
};

export default AlertBanner;
