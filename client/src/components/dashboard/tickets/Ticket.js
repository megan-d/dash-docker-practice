import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  StyledGreyLink,
  StyledGreyButton,
  StyledDeleteButton,
} from '../../../styles/styledComponents/StyledLinks';
import clsx from 'clsx';
import Wrapper from '../../layout/Wrapper';
import Spinner from '../../layout/Spinner';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import Moment from 'react-moment';
import { makeStyles } from '@material-ui/core/styles';
import { TicketContext } from '../../../context/tickets/TicketContext';
import AlertBanner from '../../layout/AlertBanner';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import PersonIcon from '@material-ui/icons/Person';
import { Select } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Comment from '../comments/Comment';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  fixedHeight: {
    minHeight: 300,
    height: 300,
  },
  paper: {
    minHeight: 300,
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
    minWidth: '180px',
    width: '180px',
    margin: 0,
  },
  datePicker: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  searchButton: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  projectContent: {
    marginBottom: 20,
  },
}));

const Ticket = (props) => {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const {
    ticket,
    getTicketDetails,
    deleteTicket,
    isLoading,
    addTicketToSprint,
    clearTicket,
  } = useContext(TicketContext);

  const [formData, updateFormData] = useState({
    sprint: '',
  });

  const { sprint } = formData;

  const onChange = (e) =>
    updateFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    getTicketDetails(props.match.params.ticketid);
    return () => clearTicket();
  }, []);

  const columns = [
    { title: 'Type of Change', field: 'typeOfChange', align: 'left' },
    { title: 'Date', field: 'date', type: 'date', align: 'right' },
  ];

  return (
    <Wrapper>
      {!ticket || isLoading || !ticket.project.sprints ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='flex'>
            <ConfirmationNumberIcon className='page-heading-icon' />
            <h2 className='page-heading'>{ticket.title}</h2>
          </div>
          <hr className='hr'></hr>
          <AlertBanner />
          {/* {(isLoading || ticket === null) && <Spinner />} */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <h4 className='page-content-subheading'>
                  Ticket Description:
                </h4>
                <p className='page-content'>{ticket.description}</p>
                <h4 className='page-content-subheading'>Ticket Status:</h4>
                <p className='page-content'>{ticket.status}</p>
                <h4 className='page-content-subheading'>
                  Assigned Developer:
                </h4>
                <div className='flex'>
                  <PersonIcon
                    className='page-heading-icon'
                    style={{ color: '#577590' }}
                  />
                  <p className='page-content'>
                    {ticket.assignedDeveloper.username}
                  </p>
                </div>
              </Paper>
            </Grid>

            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <h4 className='page-content-subheading'>Ticket Type: </h4>
                <p className='page-content'>{ticket.type}</p>
                <h4 className='page-content-subheading'>Ticket Priority: </h4>
                <p className='page-content'>{ticket.priority}</p>

                <h4 className='page-content-subheading'>Due Date: </h4>
                <Moment format='MM/DD/YYYY'>{moment(ticket.dateDue)}</Moment>
              </Paper>
            </Grid>

            <Grid item xs={12} md={3} lg={3}>
              <Paper
                className={fixedHeightPaper}
                style={{ alignItems: 'center' }}
              >
                <StyledGreyLink
                  variant='contained'
                  color='primary'
                  to={`/projects/tickets/comment/${ticket._id}`}
                >
                  Comment on Ticket
                </StyledGreyLink>
                <StyledGreyLink
                  variant='contained'
                  color='primary'
                  to={`/projects/tickets/updateticket/${ticket._id}`}
                >
                  Edit Ticket
                </StyledGreyLink>
                {ticket.project.sprints.length === 0 ? (
                  ''
                ) : (
                  <Fragment>
                    <FormControl
                      variant='outlined'
                      className={classes.formControl}
                    >
                      <InputLabel htmlFor='sprint'>Select Sprint:</InputLabel>
                      <Select
                        className={classes.dropdown}
                        native
                        value={sprint}
                        onChange={(e) => onChange(e)}
                        label='Select Ticket'
                        style={{
                          marginTop: '5px',
                          marginBottom: '5px',
                          height: '40px',
                        }}
                        inputProps={{
                          name: 'sprint',
                          id: 'sprint',
                        }}
                      >
                        <option aria-label='None' value='' />
                        {ticket.project.sprints.map((el) => (
                          <option value={el._id} key={el._id}>
                            {el.title}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <StyledGreyButton
                      style={{ display: 'inline-block' }}
                      variant='contained'
                      color='default'
                      onClick={async () => {
                        await addTicketToSprint(
                          sprint,
                          ticket._id,
                          ticket.project._id,
                          props.history,
                        );
                      }}
                    >
                      Add Ticket to Sprint
                    </StyledGreyButton>
                  </Fragment>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <Paper
                className={fixedHeightPaper}
                style={{ minHeight: '460px' }}
              >
                <ul className='page-content-subheading'>Ticket comments:</ul>
                {ticket.comments.length === 0 && !isLoading ? (
                  <p>There are no comments for this ticket</p>
                ) : ticket.comments.length > 0 && !isLoading ? (
                  ticket.comments.map((el, index) => (
                    <Comment
                      key={el._id}
                      comment={el}
                      comments={ticket.comments}
                      index={index}
                      isLoading={isLoading}
                    />
                  ))
                ) : (
                  ''
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MaterialTable
                className={fixedHeightPaper}
                style={{ minHeight: '460px', paddingLeft: '8px', paddingRight: '32px', paddingTop: '14px'}}
                localization={{
                  header: {
                    actions: '',
                  },
                }}
                title={<Typography  style={{fontSize: '15px', fontWeight: 700}}>Ticket History:</Typography>}
                columns={columns}
                data={ticket.history}
                options={{
                  filtering: false,
                  search: false,
                  align: 'center',
                  headerStyle: {
                    fontSize: '14px'
                  }
                }}
              />
            </Grid>
          </Grid>

          <StyledDeleteButton
            variant='contained'
            startIcon={<DeleteIcon />}
            onClick={async () =>
              deleteTicket(ticket.project._id, ticket._id, props.history)
            }
          >
            Delete Ticket
          </StyledDeleteButton>
          <AlertBanner />
        </Fragment>
      )}
    </Wrapper>
  );
};

export default Ticket;
