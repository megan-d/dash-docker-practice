import React, { useState, useContext, useEffect } from 'react';
import Wrapper from '../../layout/Wrapper';
import Spinner from '../../layout/Spinner';
import { StyledRedLink, StyledBlueButton } from '../../../styles/styledComponents/StyledLinks';
import { makeStyles } from '@material-ui/core/styles';
import AlertBanner from '../../layout/AlertBanner';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { ProjectContext } from '../../../context/projects/ProjectContext';
import { SprintContext } from '../../../context/sprints/SprintContext';

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

const CreateSprint = (props) => {
  const classes = useStyles();

  const { project, getProjectDetails } = useContext(ProjectContext);
  const { addSprint } = useContext(SprintContext);

  useEffect(() => {
    getProjectDetails(props.match.params.projectid);
  }, [project, props.match.params.projectid]);

  const [formData, updateFormData] = useState({
    title: '',
    description: '',
  });

  //Pull out variables from formData and userData
  const { title, description } = formData;

  // Function to update state on change using updateFormData
  const onChange = (e) =>
    updateFormData({ ...formData, [e.target.name]: e.target.value });

  //Function to send data that's in formData to database endpoint when submit is clicked
  const onSubmit = async (e) => {
    e.preventDefault();
    const sprint = {
      title: title,
      description: description,
    };
    //call add sprint action
    await addSprint(sprint, project._id, props.history);
  };

  return (
    <Wrapper>
      <h2 className='page-heading'>Create a New Sprint</h2>
      <hr className='hr'></hr>
      {!project ? (
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
                  name='title'
                  variant='outlined'
                  required
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
                  name='description'
                  variant='outlined'
                  required
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
                <AlertBanner />
                <StyledBlueButton
                  type='submit'
                  className={classes.buttons}
                  onClick={(e) => onSubmit(e)}
                >
                  SUBMIT
                </StyledBlueButton>
                <StyledRedLink
                  to={`/projects/${project._id}`}
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

export default CreateSprint;
