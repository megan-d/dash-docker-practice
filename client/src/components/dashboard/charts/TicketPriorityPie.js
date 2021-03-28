import React, { useContext, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import Spinner from '../../layout/Spinner';
import { TicketContext } from '../../../context/tickets/TicketContext';
import styled from 'styled-components';

const StyledChartDiv = styled.div`
  height: 290px;
`;

const TicketPriorityPie = () => {
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

  const ticketPriorities = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  tickets.forEach((ticket) => {
    if (ticket.priority === '1-Low') {
      ticketPriorities.low = ticketPriorities.low + 1;
    }
    if (ticket.priority === '2-Medium') {
      ticketPriorities.medium = ticketPriorities.medium + 1;
    }
    if (ticket.priority === '3-High') {
      ticketPriorities.high = ticketPriorities.high + 1;
    }
    if (ticket.priority === '4-Critical') {
      ticketPriorities.critical = ticketPriorities.critical + 1;
    }
  });

  const chartData = {
    labels: ['1-Low', '2-Medium', '3-High', '4-Critical'],
    datasets: [
      {
        label: ['Ticket Priority'],
        data: Object.values(ticketPriorities),
        backgroundColor: ['#203a43', '#f9c74f', '#F3722C', '#f94144'],
      },
    ],
  };

  return (
    <StyledChartDiv>
      {isLoading && tickets === null ? (
        <Spinner />
      ) : (
        <Pie
          data={chartData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            title: {
              display: true,
              text: 'My Assigned Tickets by Priority',
              fontSize: 14,
            },
            legend: {
              display: true,
              position: 'left',
            },
            layout: {
              padding: {
                left: 20,
                right: 20,
              },
            },
          }}
        />
      )}
    </StyledChartDiv>
  );
};

export default TicketPriorityPie;
