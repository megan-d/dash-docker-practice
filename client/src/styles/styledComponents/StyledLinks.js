import { Link } from 'react-router-dom';
import styled from 'styled-components'

export const StyledRedLink = styled(Link)`
color: white;
background-color: #f94144;
text-decoration: none;
border-radius: 3px;
padding: 10px;
font-size: 14px;
max-width: 180px;
width: 100px;
text-align: center;
margin: 10px 5px;
height: 40px;
display: inline-block;
font-weight: 500;
font-family: Roboto, sans-serif;
text-transform: uppercase;
&:hover {
  box-shadow: 0 3px 6px 0px #777;
}
`;

export const StyledGreyLink = styled(Link)`
  color: white;
  background-color: grey;
  text-decoration: none;
  border-radius: 3px;
  padding: 10px;
  font-size: 14px;
  max-width: 180px;
  width: 180px;
  text-align: center;
  margin: 5px 0px;
  height: 40px;
  display: block;
  font-weight: 500;
  font-family: Roboto, sans-serif;
  text-transform: uppercase;
  &:hover {
    background-color: #f8961e;
    box-shadow: 0 3px 6px 0px #777;
  }
`;

export const StyledBlueButton = styled.button`
color: white;
background-color: #204051;
text-decoration: none;
border-radius: 3px;
border: 0px;
padding: 10px;
font-size: 14px;
max-width: 180px;
width: 100px;
text-align: center;
margin: 5px 0px;
height: 40px;
display: inline-block;
font-weight: 500;
cursor: pointer;
font-family: Roboto, sans-serif;
text-transform: uppercase;
&:hover {
  box-shadow: 0 3px 6px 0px #777;
}
`;

export const StyledGreyButton = styled.button`
color: white;
background-color: grey;
text-decoration: none;
border-radius: 3px;
border: 0px;
padding: 10px;
font-size: 14px;
max-width: 180px;
width: 180px;
text-align: center;
margin: 5px 5px 5px 0px;
height: 40px;
display: inline-block;
font-weight: 500;
cursor: pointer;
font-family: Roboto, sans-serif;
text-transform: uppercase;
&:hover {
  box-shadow: 0 3px 6px 0px #777;
  background-color: #f8961e;
}
`;

export const StyledDeleteButton = styled.button`
color: white;
border: 0px;
cursor: pointer;
background-color: #f94144;
text-decoration: none;
border-radius: 3px;
padding: 10px;
font-size: 14px;
max-width: 180px;
width: 180px;
text-align: center;
margin: 15px 0px 0px 0px;
height: 40px;
display: block;
font-weight: 500;
font-family: Roboto, sans-serif;
text-transform: uppercase;
&:hover {
  box-shadow: 0 3px 6px 0px #777;
  background-color: #f1383b;
}
`;