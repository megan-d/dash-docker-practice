import React, { Fragment, useContext, useEffect } from 'react';
import { ProjectContext } from '../../../context/projects/ProjectContext';
import { TicketContext } from '../../../context/tickets/TicketContext';
import { AuthContext } from '../../../context/auth/AuthContext';
import clsx from 'clsx';
import { Link, useHistory } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import {
  StyledGreyLink,
  StyledDeleteButton,
} from '../../../styles/styledComponents/StyledLinks';
import Wrapper from '../../layout/Wrapper';
import moment from 'moment';
import Moment from 'react-moment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Spinner from '../../layout/Spinner';
import AlertBanner from '../../layout/AlertBanner';
import MaterialTable from 'material-table';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Comment from '../comments/Comment';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
  },
  fixedHeight: {
    minHeight: 250,
    height: 250,
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
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

function ListItemLink(props) {
  return <Link {...props} style={{ textDecoration: 'none', color: 'grey' }} />;
}

const Project = (props) => {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const {
    project,
    getProjectDetails,
    deleteProject,
    isLoading,
    clearProject,
  } = useContext(ProjectContext);

  const { clearTicket } = useContext(TicketContext);
  const { user } = useContext(AuthContext);

  // const [assignedDev, updateAssignedDev] = useState();

  useEffect(() => {
    getProjectDetails(props.match.params.projectid);
    return () => {
      clearProject();
      clearTicket();
    };
  }, []);

  const ticketColumns = [
    { title: 'Title', field: 'title' },
    { title: 'Type', field: 'type' },
    { title: 'Priority', field: 'priority' },
    { title: 'Due date', field: 'dateDue', type: 'date' },
    { title: 'Status', field: 'status' },
    // { title: 'Assigned Dev', field: 'assignedDeveloper' },
  ];

  const sprintColumns = [
    { title: 'Title', field: 'title' },
    { title: 'StartDate', field: 'startDate', type: 'date' },
    { title: 'Planned End Date', field: 'plannedEndDate', type: 'date' },
    { title: 'Status', field: 'status' },
  ];

  let history = useHistory();

  //Put the add ticket functionality here where tickets are shown for the project.
  //Only show delete and edit buttons if the user owns the project or is an admin
  return (
    <Wrapper>
      {!project || isLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          <AlertBanner />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className='flex'>
              <AssignmentIcon className='page-heading-icon' />
              <h2 className='page-heading'>{project.name}</h2>
            </div>
            <div
              style={{ display: 'flex', alignItems: 'center' }}
              className='project-date'
            >
              <h4 style={{ marginRight: '6px' }} className='project-date'>
                Target completion date:
              </h4>
              <p className='project-date'>
                <Moment format='MM/DD/YYYY'>
                  {moment(project.targetCompletionDate)}
                </Moment>
              </p>
            </div>
          </div>
          <hr className='hr'></hr>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={8}>
              <Paper className={fixedHeightPaper}>
                <h4 className='page-content-subheading'>
                  Project Description:
                </h4>
                <p>{project.description}</p>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} lg={4}>
              <Paper
                className={fixedHeightPaper}
                style={{ alignItems: 'center' }}
              >
                <StyledGreyLink
                  variant='contained'
                  to={`/projects/submitticket/${project._id}`}
                >
                  Add Ticket
                </StyledGreyLink>
                <StyledGreyLink
                  variant='contained'
                  to={`/projects/createsprint/${project._id}`}
                >
                  Add Sprint
                </StyledGreyLink>
                <StyledGreyLink
                  variant='contained'
                  to={`/projects/comment/${project._id}`}
                >
                  Comment on Project
                </StyledGreyLink>
                {user._id === project.owner || user._id === project.manager ? (
                  <Fragment>
                    <StyledGreyLink
                      variant='contained'
                      to={`/projects/${project._id}/edit`}
                    >
                      Edit Project
                    </StyledGreyLink>
                  </Fragment>
                ) : null}
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <Paper
                className={fixedHeightPaper}
                style={{ minHeight: '300px' }}
              >
                <ul className='page-content-subheading'>
                  Developers on Project:
                </ul>
                {project.developers.length > 0 && project.developers[0].username
                  ? project.developers.map((el, index) => {
                      return (
                        <Fragment key={index}>
                          <ListItemLink
                            to={`/profiles/${el._id}`}
                            className={classes.root}
                          >
                            <ListItem button>
                              <ListItemAvatar>
                                <Avatar
                                  className={classes.root}
                                  style={{
                                    height: '40px',
                                    width: '40px',
                                    color: '#fafafa',
                                    backgroundColor:
                                      colors[index % colors.length],
                                  }}
                                >
                                  {el.firstName.charAt(0).toUpperCase()}
                                  {el.lastName.charAt(0).toUpperCase()}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary={el.username} />
                            </ListItem>
                          </ListItemLink>
                          <Divider
                            variant='inset'
                            component='li'
                            style={{ listStyle: 'none' }}
                          />
                        </Fragment>
                      );
                    })
                  : ''}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Paper
                className={fixedHeightPaper}
                style={{ minHeight: '300px' }}
              >
                <ul className='page-content-subheading'>Project Tech Stack:</ul>
                {project.techStack.length === 0 && !isLoading ? (
                  <p>No listed technologies</p>
                ) : (
                  project.techStack.map((el, index) => {
                    return (
                      <Fragment key={index}>
                        <ListItem>
                          <ListItemAvatar>
                            <CheckCircleOutlineIcon className='list-icon' />
                          </ListItemAvatar>
                          <ListItemText
                            primary={el}
                            style={{ fontSize: '14px' }}
                          />
                        </ListItem>
                        <Divider
                          variant='inset'
                          component='li'
                          style={{ listStyle: 'none' }}
                        />
                      </Fragment>
                    );
                  })
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* {user._id === project.manager && user._id !== project.owner ? (
            <Fragment>
              <StyledGreyLink
                variant='contained'
                to={`/projects/${project._id}/edit`}
              >
                Edit Project
              </StyledGreyLink>
            </Fragment>
          ) : null} */}
          <MaterialTable
            style={{ marginTop: '20px' }}
            localization={{
              header: {
                actions: '',
              },
            }}
            title={
              <Fragment>
                <Typography
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    paddingRight: '20px',
                  }}
                  className='project-table-title'
                >
                  Tickets:
                </Typography>
                <Typography
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    paddingRight: '20px',
                  }}
                  className='project-table-title-mobile'
                >
                  Tickets:
                </Typography>
              </Fragment>
            }
            columns={ticketColumns}
            data={project.tickets.map((el) => {
              return {
                key: el._id,
                id: el._id,
                title: el.title,
                type: el.type,
                priority: el.priority,
                dateDue: el.dateDue,
                status: el.status,
                // assignedDeveloper: <AvatarIcon user={'H'} />,
              };
            })}
            options={{
              pageSize: 5,
              pageSizeOptions: [5, 10, 20, 30],
              toolbar: true,
              paging: true,
              options: {
                rowStyle: {
                  padding: '0px',
                },
              },
              headerStyle: {
                backgroundColor: '#204051',
                color: '#fafafa',
              },
            }}
            onRowClick={async (event, rowData) => {
              history.push(`/ticket/${rowData.id}`);
            }}
          />
          <MaterialTable
            style={{ marginTop: '20px', marginBottom: '20px' }}
            localization={{
              header: {
                actions: '',
              },
            }}
            title={
              <Fragment>
                <Typography
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    paddingRight: '20px',
                  }}
                  className='project-table-title'
                >
                  Sprints:
                </Typography>
                <Typography
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    paddingRight: '20px',
                  }}
                  className='project-table-title-mobile'
                >
                  Sprints:
                </Typography>
              </Fragment>
            }
            columns={sprintColumns}
            data={project.sprints.map((el) => {
              return {
                key: el._id,
                id: el._id,
                title: el.title,
                startDate: el.startDate,
                plannedEndDate: el.plannedEndDate,
                status: el.status,
              };
            })}
            options={{
              pageSize: 5,
              pageSizeOptions: [5, 10, 20, 30],
              toolbar: true,
              paging: true,
              options: {
                rowStyle: {
                  padding: '0px',
                },
              },
              headerStyle: {
                backgroundColor: '#204051',
                color: '#fafafa',
              },
            }}
            onRowClick={async (event, rowData) => {
              history.push(`/sprint/${rowData.id}`);
            }}
          />

          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper className={fixedHeightPaper}>
                <ul className='page-content-subheading'>Project comments:</ul>
                {project.comments.length === 0 && !isLoading ? (
                  <p>There are no comments for this project</p>
                ) : project.comments.length > 0 && !isLoading ? (
                  project.comments.map((el, index) => (
                    <Comment
                      key={el._id}
                      comment={el}
                      comments={project.comments}
                      index={index}
                      isLoading={isLoading}
                    />
                  ))
                ) : (
                  ''
                )}
              </Paper>
            </Grid>
          </Grid>

          {user._id === project.owner ? (
            <Fragment>
              <StyledDeleteButton
                variant='contained'
                startIcon={<DeleteIcon />}
                onClick={async () => deleteProject(project._id, props.history)}
                className={classes.button}
                style={{ marginTop: '20px' }}
              >
                Delete Project
              </StyledDeleteButton>
            </Fragment>
          ) : null}
        </Fragment>
      )}
    </Wrapper>
  );
};

export default Project;
