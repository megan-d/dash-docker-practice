import React, { useEffect, useContext, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ProjectContext } from '../../../context/projects/ProjectContext';
import { AuthContext } from '../../../context/auth/AuthContext';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import Wrapper from '../../layout/Wrapper';
import Spinner from '../../layout/Spinner';
import ProjectCard from './ProjectCard';
import styled from 'styled-components';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const StyledCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 25px;
`;

const StyledLink = styled(Link)`
  color: white;
  background: #204051;
  text-decoration: none;
  border-radius: 3px;
  padding: 10px;
  font-size: 14px;
  max-width: 100px;
  text-align: center;
  margin: 10px 0px;
  display: block;
  font-weight: bold;
  &:hover {
    box-shadow: 0 3px 6px 0px #777;
    background: #f8961e;
  }
`;

const useStyles = makeStyles({
  root: {
    minWidth: 250,
    width: 160,
    margin: '5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: '#333333',
    minHeight: 126,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const colors = [
  'grey',
  '#F3722C',
  '#F8961E',
  '#F9C74F',
  '#90BE6D',
  '#43AA8B',
  '#577590',
  '#203a43',
];

const Projects = (props) => {
  const { projects, isLoading, getUserProjects } = useContext(
    ProjectContext,
  );

  const { user } = useContext(AuthContext);

  const classes = useStyles();

  useEffect(() => {
    getUserProjects();
    // return () => clearProjects();
  }, []);

  // let history = useHistory();

  //Get projects where user is the manager or owner and put them under "My Projects"
  let myProjects = projects.filter((el) => el.owner === user._id);
  let managing = projects.filter(
    (el) => el.manager === user._id && el.owner !== user._id,
  );
  //Get projects where user is a collaborating developer and put them under "Projects I'm collaborating on"
  let collaboratingProjects = projects.filter((el) =>
    el.developers.some((developer) => developer === user._id),
  );
  let collabProjects = collaboratingProjects.filter(
    (el) => el.owner !== user._id,
  );

  //TODO: Need to fix loading so there aren't two spinners. One is coming from PrivateRoute component
  return (
    <Wrapper>
      <h2 className='page-heading'>Projects</h2>
      <p>
        View your own projects as well as projects you are managing and
        collaborating on
      </p>
      <StyledLink to='/createproject'>Add Project</StyledLink>
      <hr className='hr'></hr>

      {isLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h3 className='subheading'>My Projects</h3>
          {!isLoading && myProjects.length === 0 ? (
            <StyledCards>
              <Card
                className={classes.root}
                style={{ border: `1px solid #f3f3f3` }}
              >
                <CardContent>
                  <Typography>No projects available</Typography>
                </CardContent>
              </Card>
            </StyledCards>
          ) : (
            <StyledCards>
              {myProjects.map((el, index) => {
                return (
                  <ProjectCard
                    key={el._id}
                    name={el.name}
                    description={el.description}
                    id={el._id}
                    color={colors[index % colors.length]}
                  />
                );
              })}
            </StyledCards>
          )}
          <h3 className='subheading'>Projects I'm managing</h3>
          {managing.length === 0 && !isLoading ? (
            <StyledCards>
              <Card
                className={classes.root}
                style={{ border: `1px solid #f3f3f3` }}
              >
                <CardContent>
                  <Typography>No projects available</Typography>
                </CardContent>
              </Card>
            </StyledCards>
          ) : (
            <StyledCards>
              {managing.map((el, index) => {
                return (
                  <ProjectCard
                    key={el._id}
                    name={el.name}
                    description={el.description}
                    id={el._id}
                    color={colors[index % colors.length]}
                  />
                );
              })}
            </StyledCards>
          )}

          <h3 className='subheading'>Projects I'm collaborating on</h3>
          {collabProjects.length === 0 && !isLoading ? (
            <StyledCards>
              <Card
                className={classes.root}
                style={{ border: `1px solid #f3f3f3` }}
              >
                <CardContent>
                  <Typography>No projects available</Typography>
                </CardContent>
              </Card>
            </StyledCards>
          ) : (
            <StyledCards>
              {collabProjects.map((el, index) => {
                return (
                  <ProjectCard
                    key={el._id}
                    name={el.name}
                    description={el.description}
                    id={el._id}
                    color={colors[index % colors.length]}
                  />
                );
              })}
            </StyledCards>
          )}
        </Fragment>
      )}
    </Wrapper>
  );
};

export default Projects;
