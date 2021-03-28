import React, { useContext, useEffect, useState } from 'react';
import AlertBanner from '../../layout/AlertBanner';
import { ProjectContext } from '../../../context/projects/ProjectContext';
import {
  StyledRedLink,
  StyledGreyLink,
  StyledBlueButton,
} from '../../../styles/styledComponents/StyledLinks';
import Wrapper from '../../layout/Wrapper';
import Spinner from '../../layout/Spinner';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

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
    margin: theme.spacing(1),
    minWidth: 120,
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

export default function EditProject(props) {
  const classes = useStyles();

  const {
    project,
    isLoading,
    updateProject,
    getProjectDetails,
    clearProject,
  } = useContext(ProjectContext);

  useEffect(() => {
    getProjectDetails(props.match.params.projectid);
    return () => clearProject();
  }, []);

  const [formData, updateFormData] = useState({
    name: '',
    description: '',
    manager: '',
    repoLink: '',
    liveLink: '',
    developer: '',
    techStack: '',
  });

  //   const [access, setAccess] = useState('public');

  //   const handleChange = (event) => {
  //     setAccess(event.target.value);
  //   };

  //TODO: Need to fix how target completion date is shown in placeholder text.
  //TODO: Need to find way to display username rather than id. Try populate.
  const [targetCompletionDate, setSelectedTargetDate] = useState(null);
  const [completionDate, setSelectedCompletionDate] = useState(null);

  const handleTargetDateChange = (date) => {
    setSelectedTargetDate(date);
  };

  const handleCompletionDateChange = (date) => {
    setSelectedCompletionDate(date);
  };

  //Pull out variables from formData and userData
  const {
    name,
    description,
    manager,
    developer,
    repoLink,
    liveLink,
    techStack,
  } = formData;

  // Function to update state on change using updateFormData
  const onChange = (e) =>
    updateFormData({ ...formData, [e.target.name]: e.target.value });

  //Function to send data that's in formData to database endpoint when submit is clicked
  const onSubmit = async (e) => {
    e.preventDefault();
    const projectUpdates = {
      name: name,
      description: description,
      targetCompletionDate: targetCompletionDate,
      completionDate: completionDate,
      manager: manager,
      repoLink: repoLink,
      liveLink: liveLink,
      developer: developer,
      techStack: techStack,
    };
    //call add project action
    await updateProject(projectUpdates, project._id, props.history);
  };

  return (
    <Wrapper>
      <h2 className='page-heading'>Edit Project</h2>
      <hr className='hr'></hr>

      {!project || isLoading ? (
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
                  autoComplete='name'
                  label='Name'
                  placeholder={project.name}
                  name='name'
                  variant='outlined'
                  fullWidth
                  id='name'
                  autoFocus
                  value={name}
                  onChange={(e) => onChange(e)}
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  autoComplete='description'
                  label='Description'
                  placeholder={project.description}
                  name='description'
                  variant='outlined'
                  fullWidth
                  id='description'
                  value={description}
                  onChange={(e) => onChange(e)}
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                {/* <FormControl component='fieldset'>
                <FormLabel component='legend'>Select project access</FormLabel>
                <RadioGroup
                  aria-label='gender'
                  name='gender1'
                  value={access}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value='public'
                    control={<Radio />}
                    label='Public'
                  />
                  <FormControlLabel
                    value='private'
                    control={<Radio />}
                    label='Private'
                  />
                </RadioGroup>
              </FormControl> */}

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify='flex-start'>
                    <KeyboardDatePicker
                      // placeholder={project.targetCompletionDate}
                      disableToolbar
                      variant='inline'
                      format='MM/dd/yyyy'
                      margin='normal'
                      id='date-picker-inline'
                      label='Target Completion Date'
                      value={targetCompletionDate}
                      onChange={(targetCompletionDate) =>
                        handleTargetDateChange(targetCompletionDate)
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify='flex-start'>
                    <KeyboardDatePicker
                      disableToolbar
                      placeholder={
                        project.completionDate ? project.completionDate : null
                      }
                      variant='inline'
                      format='MM/dd/yyyy'
                      margin='normal'
                      id='date-picker-inline'
                      label='Completion Date'
                      helperText='Select a date if the project is complete.'
                      value={completionDate}
                      onChange={(completionDate) =>
                        handleCompletionDateChange(completionDate)
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>

                <TextField
                  variant='outlined'
                  fullWidth
                  name='manager'
                  label='Project Manager username'
                  helperText='You will be assigned as manager if left blank. Select the button below to find users.'
                  id='manager'
                  value={manager}
                  onChange={(e) => onChange(e)}
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  variant='outlined'
                  fullWidth
                  name='developer'
                  label='Developer username'
                  helperText='Add a user as a developer on the project.'
                  id='developer'
                  value={developer}
                  onChange={(e) => onChange(e)}
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <StyledGreyLink to='/profiles'>
                  Search for user...
                </StyledGreyLink>
                <TextField
                  variant='outlined'
                  fullWidth
                  name='techStack'
                  label='Technologies used'
                  helperText='Please enter the technologies used for this project separated by a comma. (e.g. JavaScript, Node, React)'
                  id='techStack'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={techStack}
                  onChange={(e) => onChange(e)}
                  margin='normal'
                />
                <TextField
                  placeholder={project.repoLink ? project.repoLink : null}
                  variant='outlined'
                  fullWidth
                  name='repoLink'
                  label='URL for project repo'
                  id='repoLink'
                  value={repoLink}
                  onChange={(e) => onChange(e)}
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  placeholder={project.liveLink ? project.liveLink : null}
                  variant='outlined'
                  fullWidth
                  name='liveLink'
                  label='URL for live project'
                  id='liveLink'
                  value={liveLink}
                  onChange={(e) => onChange(e)}
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
                <StyledRedLink to='/projects' className={classes.buttons}>
                  CANCEL
                </StyledRedLink>
                <StyledGreyLink to='/projects' className={classes.buttons}>
                  BACK TO PROJECTS
                </StyledGreyLink>
              </form>
            </div>
          </Grid>
        </Grid>
      )}
    </Wrapper>
  );
}
