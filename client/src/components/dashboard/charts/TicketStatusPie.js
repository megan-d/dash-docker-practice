import React, { useContext, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { TicketContext } from '../../../context/tickets/TicketContext';
import Spinner from '../../layout/Spinner';
import styled from 'styled-components';

const StyledChartDiv = styled.div`
  height: 290px;
`;

const TicketStatusPieChart = () => {
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

  const ticketStatuses = {
    assigned: 0,
    inProgress: 0,
    underReview: 0,
  };

  tickets.forEach((ticket) => {
    if (ticket.status === 'Assigned') {
      ticketStatuses.assigned = ticketStatuses.assigned + 1;
    }
    if (ticket.status === 'In Progress') {
      ticketStatuses.inProgress = ticketStatuses.inProgress + 1;
    }
    if (ticket.status === 'Under Review') {
      ticketStatuses.underReview = ticketStatuses.underReview + 1;
    }
  });

  const chartData = {
    labels: ['Assigned', 'In Progress', 'Under Review'],
    datasets: [
      {
        label: 'Ticket Status',
        data: Object.values(ticketStatuses),
        backgroundColor: ['#90BE6D',
        '#43AA8B',
        '#577590',],
      },
    ],
  };

  return (
    <StyledChartDiv>
      {isLoading && tickets === null ? (
        <Spinner />
      ) : (
        <Doughnut
          data={chartData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            title: {
              display: true,
              text: 'My Pending Tickets By Type',
              fontSize: 14,
            },
            legend: {
              display: true,
              position: 'right',
            },
            layout: {
              padding: {
                left: 1,
                right: 1,
              },
            },
          }}
        />
      )}
    </StyledChartDiv>
  );
};

export default TicketStatusPieChart;
