import React, { useState, useContext, useEffect } from 'react';
import Wrapper from '../../layout/Wrapper';
import Spinner from '../../layout/Spinner';
import { StyledRedLink, StyledGreyLink, StyledBlueButton } from '../../../styles/styledComponents/StyledLinks';
import { makeStyles } from '@material-ui/core/styles';
import AlertBanner from '../../layout/AlertBanner';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { SprintContext } from '../../../context/sprints/SprintContext';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#204051',
    },
    '& label.Mui-focused': {
      color: '#204051',
    },
  },
  paper: {
    margin: theme.spacing(4, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    margin: theme.spacing(1, 0),
    minWidth: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  buttons: {
    marginRight: '10px',
    marginTop: '20px',
  },
  findButton: {
    fontSize: '11px',
    marginBottom: '10px',
    marginTop: '1px',
  },
}));

const UpdateSprint = (props) => {
  const classes = useStyles();

  const { sprint, updateSprint, getSprintDetails, clearSprint } = useContext(SprintContext);

  useEffect(() => {
    getSprintDetails(props.match.params.sprintid);
    return () => clearSprint();
  }, []);

  const [formData, updateFormData] = useState({
    title: '',
    description: '',
    status: '',
    developer: '',
    resolutionSummary: '',
  });

  //Pull out variables from formData and userData
  const { title, description, status, developer, resolutionSummary } = formData;

  const [startDate, setStartDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const [plannedEndDate, setEndDate] = useState(null);

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const [dateCompleted, setCompletedDate] = useState(null);

  const handleCompletionDateChange = (date) => {
    setCompletedDate(date);
  };

  // Function to update state on change using updateFormData
  const onChange = (e) =>
    updateFormData({ ...formData, [e.target.name]: e.target.value });

  //Function to send data that's in formData to database endpoint when submit is clicked
  const onSubmit = async (e) => {
    e.preventDefault();
    const edits = {
      title: title,
      description: description,
      status: status,
      developer: developer,
      resolutionSummary: resolutionSummary,
      startDate: startDate,
      plannedEndDate: plannedEndDate,
      dateCompleted: dateCompleted,
    };
    //call add sprint action
    await updateSprint(edits, sprint.project._id, sprint._id, props.history);
  };

  return (
    <Wrapper>
      <h2 className='page-heading'>Update Sprint</h2>
      <hr className='hr'></hr>
      <p style={{marginBottom: '10px'}}>Please ensure that you provide a status for the sprint's history.</p>
      {!sprint ? (
        <Spinner />
      ) : (
        <Grid container component='main' className={classes.root}>
          <Grid
            item
            xs={12}
            sm={8}
            md={8}
            component={Paper}
            elevation={6}
            square
          >
            <div className={classes.paper}>
              <form
                className={classes.form}
                action=''
                onSubmit={(e) => onSubmit(e)}
              >
                <TextField
                  autoComplete='title'
                  placeholder={sprint.title}
                  name='title'
                  variant='outlined'
                  fullWidth
                  id='title'
                  label='Sprint Title'
                  autoFocus
                  value={title}
                  onChange={(e) => onChange(e)}
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  autoComplete='description'
                  placeholder={sprint.description}
                  name='description'
                  variant='outlined'
                  fullWidth
                  multiline
                  rows={6}
                  id='description'
                  label='Sprint Description'
                  value={description}
                  onChange={(e) => onChange(e)}
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <FormControl variant='outlined' className={classes.formControl}>
                  <InputLabel htmlFor='status'>Status</InputLabel>
                  <Select
                    required
                    placeholder={sprint.status}
                    native
                    value={status}
                    onChange={(e) => onChange(e)}
                    label='status'
                    inputProps={{
                      name: 'status',
                      id: 'status',
                    }}
                  >
                    <option aria-label='None' value='' />
                    <option value={'Sprint Created'}>Sprint Created</option>
                    <option value={'In Progress'}>In Progress</option>
                    <option value={'Completed'}>Completed</option>
                  </Select>
                </FormControl>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify='flex-start'>
                    <KeyboardDatePicker
                      disableToolbar
                      placeholder={sprint.startDate}
                      variant='inline'
                      format='MM/dd/yyyy'
                      margin='normal'
                      id='startDate'
                      label='Start Date'
                      value={startDate}
                      onChange={(startDate) => handleStartDateChange(startDate)}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify='flex-start'>
                    <KeyboardDatePicker
                      disableToolbar
                      placeholder={sprint.plannedEndDate}
                      variant='inline'
                      format='MM/dd/yyyy'
                      margin='normal'
                      id='plannedEndDate'
                      label='Planned End Date'
                      value={plannedEndDate}
                      onChange={(plannedEndDate) =>
                        handleEndDateChange(plannedEndDate)
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
                <TextField
                  variant='outlined'
                  fullWidth
                  name='developer'
                  label='Add Developer to Sprint (Username)'
                  id='developer'
                  value={developer}
                  onChange={(e) => onChange(e)}
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <StyledGreyLink to='/profiles' className={classes.searchButton}>
                  Search for user...
                </StyledGreyLink>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify='flex-start'>
                    <KeyboardDatePicker
                      disableToolbar
                      placeholder={sprint.dateCompleted}
                      variant='inline'
                      format='MM/dd/yyyy'
                      margin='normal'
                      id='dateCompleted'
                      label='Date Completed'
                      value={dateCompleted}
                      onChange={(dateCompleted) =>
                        handleCompletionDateChange(dateCompleted)
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
                <TextField
                  name='resolutionSummary'
                  placeholder={sprint.resolutionSummary}
                  variant='outlined'
                  fullWidth
                  id='resolutionSummary'
                  label='Summary of Ticket Resolution'
                  value={resolutionSummary}
                  onChange={(e) => onChange(e)}
                  multiline
                  rows={6}
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <AlertBanner />
                <StyledBlueButton
                  type='submit'
                  className={classes.buttons}
                  onClick={(e) => onSubmit(e)}
                >
                  SUBMIT
                </StyledBlueButton>
                <StyledRedLink
                  to={`/sprint/${sprint._id}`}
                  className={classes.buttons}
                >
                  CANCEL
                </StyledRedLink>
              </form>
            </div>
          </Grid>
        </Grid>
      )}
    </Wrapper>
  );
};

export default UpdateSprint;
