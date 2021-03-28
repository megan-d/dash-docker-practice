import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const StyledFooter = styled.footer`
  background-color: #204051;
  margin: 0;
  color: #eceff0;`

function Copyright() {
  return (
    <Typography variant="body2" align="center">
      {'Copyright © '}
      <Link href="https://material-ui.com/" style={{textDecoration: 'none', color: '#eceff0'}}>
        Dash
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Footer = () => {
  return (
    <StyledFooter>
    <Copyright />
    </StyledFooter>
  );
}

export default Footer;