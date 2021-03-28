import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { TicketContext } from '../../../context/tickets/TicketContext';
import Wrapper from '../../layout/Wrapper';
import Spinner from '../../layout/Spinner';
import MaterialTable from 'material-table';
import Typography from '@material-ui/core/Typography';

const Tickets = (props) => {
  const sortedPriority = (priority) => {
    switch (priority) {
      case 'Low':
        return 1;
      case 'Medium':
        return 2;
      case 'High':
        return 3;
      case 'Critical':
        return 4;
      default:
        return 1;
    }
  };

  const {
    tickets,
    isLoading,
    getUserTickets,
    clearTickets,
  } = useContext(TicketContext);

  useEffect(() => {
    getUserTickets();
    return () => clearTickets();
  }, []);

  const columns = [
    { title: 'Title', field: 'title' },
    { title: 'Type', field: 'type' },
    {
      title: 'Priority',
      field: 'priority',
      customSort: (a, b) => (sortedPriority(a) > sortedPriority(b) ? 1 : -1),
    },
    { title: 'Due date', field: 'dateDue', type: 'date' },
    { title: 'Status', field: 'status' },
  ];

  let history = useHistory();

  //TODO: Need to fix loading so there aren't two spinners. One is coming from PrivateRoute component
  return (
    <Wrapper>
      <h2 className='page-heading'>My Tickets</h2>
      <p>
        View your assigned tickets. Select a ticket to view the ticket details.
      </p>
      <hr className='hr'></hr>
      {isLoading ? (
        <Spinner />
      ) : (
        <MaterialTable
          localization={{
            header: {
              actions: 'View Project',
            },
          }}
          title={<Typography  style={{fontSize: '16px', fontWeight: 700}} className='table-title'>Tickets</Typography>}
          columns={columns}
          actions={[
            {
              icon: 'visibility',
              tooltip: 'View Project',
              onClick: (event, rowData) =>
                props.history.push(`/projects/${rowData.project._id}`),
            },
          ]}
          data={tickets}
          onRowClick={async (event, rowData) => {
            history.push(`/ticket/${rowData._id}`);
          }}
          options={{
            pageSize: 5,
            pageSizeOptions: [5, 10, 20, 30],
            toolbar: true,
            paging: true,
            actionsColumnIndex: -1,
            sorting: true,
            headerStyle: {
              backgroundColor: '#204051',
              color: '#fafafa',
            },
          }}
          style={{color: '#333333'}}
        />
      )}
    </Wrapper>
  );
};

export default Tickets;
