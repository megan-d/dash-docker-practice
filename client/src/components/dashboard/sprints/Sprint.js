import React, { Fragment, useContext, useEffect } from 'react';
import Wrapper from '../../layout/Wrapper';
import Spinner from '../../layout/Spinner';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import AlertBanner from '../../layout/AlertBanner';
import MaterialTable from 'material-table';
import {
  StyledGreyLink,
  StyledDeleteButton,
} from '../../../styles/styledComponents/StyledLinks';
import { SprintContext } from '../../../context/sprints/SprintContext';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Comment from '../comments/Comment';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  fixedHeight: {
    minHeight: 330,
    height: 330,
  },
  paper: {
    minHeight: 330,
    padding: theme.spacing(4),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    marginBottom: 20,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    maxWidth: '300px',
    display: 'block',
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: '85%',
    maxWidth: '85%',
  },
  buttons: {
    marginRight: '10px',
    marginTop: '20px',
  },
  findButton: {
    fontSize: '11px',
    marginBottom: '10px',
    marginTop: '1px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dropdown: {
    minWidth: '300px',
  },
  datePicker: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  searchButton: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
}));

const colors = [
  // '#F94144',
  '#577590',
  '#43AA8B',
  '#F9C74F',
  '#F8961E',
  '#90BE6D',
  '#F3722C',
  'grey',
];

function ListItemLink(props) {
  return <Link {...props} style={{ textDecoration: 'none', color: 'grey' }} />;
}

const Sprint = (props) => {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const {
    sprint,
    getSprintDetails,
    deleteSprint,
    isLoading,
    removeTicketFromSprint,
    clearSprint,
  } = useContext(SprintContext);

  const ticketColumns = [
    { title: 'Title', field: 'title' },
    { title: 'Type', field: 'type' },
    { title: 'Priority', field: 'priority' },
    { title: 'Due date', field: 'dateDue', type: 'date' },
    { title: 'Status', field: 'status' },
    // { title: 'Assigned Dev', field: 'assignedDeveloper' },
  ];

  // let history = useHistory();

  useEffect(() => {
    getSprintDetails(props.match.params.sprintid);
    return () => clearSprint();
  }, []);

  const columns = [
    { title: 'Status', field: 'status', align: 'left' },
    { title: 'Date', field: 'date', type: 'date', align: 'right' },
  ];

  return (
    <Wrapper>
      {!sprint || isLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div style={{ display: 'flex' }}>
            <GroupWorkIcon style={{ marginRight: '10px', color: '#43aa8b' }} />
            <h2 className='page-heading'>{sprint.title}</h2>
          </div>
          <hr className='hr'></hr>
          <AlertBanner />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <h4 className='page-content-subheading'>Sprint Description:</h4>
                <p className='page-content'>{sprint.description}</p>
                <h4 className='page-content-subheading'>Sprint Status:</h4>
                <p className='page-content'>{sprint.status}</p>
                <h4 className='page-content-subheading'>Project:</h4>
                <p className='page-content'>{sprint.project.name}</p>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <MaterialTable
                className={(fixedHeightPaper, classes.typography)}
                style={{
                  height: '330px',
                  paddingLeft: '8px',
                  paddingRight: '32px',
                  paddingTop: '14px',
                }}
                localization={{
                  header: {
                    actions: '',
                  },
                }}
                title={
                  <Typography style={{ fontSize: '15px', fontWeight: 700 }}>
                    Sprint Status Log:
                  </Typography>
                }
                columns={columns}
                data={sprint.statusLog}
                options={{
                  filtering: false,
                  pageSize: 3,
                  pageSizeOptions: [3, 5, 10, 20, 30],
                  paging: true,
                  search: false,
                  align: 'center',
                  headerStyle: {
                    fontSize: '14px',
                  },
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={4}>
              <Paper className={fixedHeightPaper}>
                <ul className='page-content-subheading'>
                  Developers on Sprint:
                </ul>
                {sprint.developers.length > 0 && sprint.developers[0].firstName
                  ? sprint.developers.map((el, index) => {
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
            <Grid item xs={12} md={8} lg={8}>
              <Paper className={fixedHeightPaper}>
                <ul className='page-content-subheading'>Sprint comments:</ul>
                {sprint.comments.length === 0 && !isLoading ? (
                  <p>There are no comments for this sprint</p>
                ) : sprint.comments.length > 0 && !isLoading ? (
                  sprint.comments.map((el, index) => (
                    <Comment
                      key={el._id}
                      comment={el}
                      comments={sprint.comments}
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

          <MaterialTable
            style={{
              paddingLeft: '8px',
              paddingRight: '32px',
              paddingTop: '14px',
            }}
            localization={{
              header: {
                actions: 'Remove',
              },
            }}
            title={
              <Typography style={{ fontSize: '15px', fontWeight: 700 }}>
                Tickets:
              </Typography>
            }
            columns={ticketColumns}
            data={sprint.tickets.map((el) => {
              return {
                id: el._id,
                title: el.title,
                type: el.type,
                priority: el.priority,
                dateDue: el.dateDue,
                status: el.status,
                // assignedDeveloper: <AvatarIcon user={'H'} />,
              };
            })}
            actions={[
              {
                icon: 'remove_circle',
                tooltip: 'Remove Ticket from Sprint',
                onClick: (event, rowData) => {
                  //CREATE FUNCTION TO REMOVE TICKET FROM SPRINT
                  removeTicketFromSprint(sprint._id, rowData.id, props.history);
                  props.history.push(`/sprint/${sprint._id}`);
                },
              },
            ]}
            options={{
              pageSize: 3,
              pageSizeOptions: [3, 5, 10, 20, 30],
              toolbar: true,
              paging: true,
              options: {
                rowStyle: {
                  padding: '0px',
                },
              },
              actionsColumnIndex: -1,
            }}
            onRowClick={async (event, rowData) => {
              props.history.push(`/ticket/${rowData.id}`);
            }}
          />

          <StyledGreyLink
            variant='contained'
            color='primary'
            to={`/projects/sprints/comment/${sprint._id}`}
          >
            Comment on Sprint
          </StyledGreyLink>
          <StyledGreyLink
            variant='contained'
            color='primary'
            to={`/projects/sprints/updatesprint/${sprint._id}`}
            style={{ marginBottom: '20px' }}
          >
            Edit Sprint
          </StyledGreyLink>
          <p>
            Select the button below to delete this sprint. Warning: This cannot
            be undone.
          </p>
          <StyledDeleteButton
            variant='contained'
            startIcon={<DeleteIcon />}
            onClick={async () =>
              deleteSprint(sprint.project._id, sprint._id, props.history)
            }
          >
            Delete Sprint
          </StyledDeleteButton>
        </Fragment>
      )}
    </Wrapper>
  );
};

export default Sprint;
