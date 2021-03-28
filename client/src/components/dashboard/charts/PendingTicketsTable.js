import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { TicketContext } from '../../../context/tickets/TicketContext';
import Spinner from '../../layout/Spinner';
import MaterialTable from 'material-table';
import Typography from '@material-ui/core/Typography';

const PendingTicketsTable = (props) => {
  const { tickets, isLoading, getUserTickets, clearTickets } = useContext(
    TicketContext,
  );

  useEffect(() => {
    getUserTickets();
    return () => clearTickets();
  }, []);

  const pendingTickets = tickets.filter((el) => el.status !== 'Completed');

  const columns = [
    { title: 'Title', field: 'title' },
    { title: 'Due Date', field: 'dateDue', type: 'date' },
    {
      title: 'Priority',
      field: 'priority',
    },
    { title: 'Status', field: 'status' },
  ];

  let history = useHistory();

  //TODO: Need to fix loading so there aren't two spinners. One is coming from PrivateRoute component
  return (
    <div>
      {isLoading && tickets === null ? (
        <Spinner />
      ) : (
        <MaterialTable
          localization={{
            header: {
              actions: '',
            },
          }}
          title={<Typography  style={{fontSize: '16px', fontWeight: 700, color: '#666666'}}>My Pending Tickets</Typography>}
          columns={columns}
          data={pendingTickets}
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
            search: false,
            headerStyle: {
              backgroundColor: '#204051',
              color: '#fafafa',
            },
            maxBodyHeight: 330,
            minBodyHeight: 330,
          }}
          style={{color: '#333333'}}
        />
      )}
    </div>
  );
};

export default PendingTicketsTable;
