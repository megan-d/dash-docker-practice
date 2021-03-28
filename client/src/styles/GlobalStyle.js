import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

* {
  margin: 0px;
  padding: 0px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

#root {
  min-height: 100vh;
}

body {
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: #333333;
}

html {
  height: 100%;
}

footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  margin-top: auto;
  flex-shrink: 0;
  font-size: 13px;
}

footer p {
  margin-bottom: 0;
}

.subheading {
  font-size: 18px;
  font-weight: 500;
  font-style: italic;
}

.box-shadow {
  box-shadow: 0 0 4px rgb(143, 141, 141);
}

.full-page {
  min-height: 85vh;
}

.flex {
  display: flex;
}

input {
  border-radius: 2px;
  border: 0.1px solid black;
}

/* Make search not appear rounded on safari mobile */
input[type="search"] {
  -webkit-appearance: none;
}

/* input:focus{
  outline: none;
  border: 1px solid #fdc108;
} */



.dark-text {
  color: #333333;
}

.dark-blue {
  background: #204051;
}
.red {
  background: #f94144;
}
.dark-orange {
  
}
.light-orange {
  
}
.yellow {
  
}

.light-green {
  
}

.aqua {
  
}

.lightblue {
  
}

.btn:focus{
  outline: none;
}

.hr {
  height: 1.5px;
  border: none;
  background: #204051;
  margin-bottom: 20px;
  margin-top: 10px;
}

.page-heading {
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
}

.page-heading-icon {
  color: #43aa8b;
  margin-right: 10px;
}

.page-content-subheading {
  font-weight: 700;
  margin-bottom: 12px;
  font-size: 15px;
}

.page-content {
  margin-bottom: 20px;
}

.list-icon {
  color: #43aa8b;
}

.MuiTableCell-head, .MuiTableCell-body {
  padding-left: 24px;
  padding-right: 24px;
}

.MuiTableCell-paddingCheckbox:last-child {
   
    padding-right: 24px;
}

img:-moz-loading {
    visibility: hidden;
}

@media (max-width: 700px) {
  .table-title, .project-date {
    display: none;
  }
  .project-table-title {
    display: none;
  }
}

@media (min-width: 701px) {
  .project-table-title-mobile {
    display: none;
  }
}
`;


export default GlobalStyle;
