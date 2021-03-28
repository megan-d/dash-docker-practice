import { AuthContext } from '../../context/auth/AuthContext';

const { register } = useContext(AuthContext);

//Users for database (other than demo user)
export const seedDatabase = () => {
  const user1 = {
    firstName: 'Sam',
    lastName: 'Jones',
    username: 'Sammy',
    email: 'sammy@sammy.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user1Profile = {
    bio:
      'I am a full stack web developer looking to collaborate on a variety of projects. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra. Aenean tortor urna, consectetur varius mauris sit amet, sodales maximus nisl. Nam dictum orci id vestibulum imperdiet. Sed pellentesque nibh et augue consequat, ac sodales neque vestibulum.',
    skills: 'HTML, CSS, JavaScript, Python, Node.js, React, Angular, MongoDB',
  };

  const user2 = {
    firstName: 'Mary',
    lastName: 'Larkey',
    username: 'Mary78',
    email: 'mary@mary.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user2Profile = {
    bio:
      'I am an experienced front end developer working on a variety of personal projects. I would enjoy collaborating with other developers. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra. Aenean tortor urna, consectetur varius mauris sit amet, sodales maximus nisl. Nam dictum orci id vestibulum imperdiet.',
    skills: 'HTML, CSS, Sass, JavaScript, PHP, Node.js, Vue',
  };

  const user3 = {
    firstName: 'Maddie',
    lastName: 'Knight',
    username: 'Maddie',
    email: 'maddie@maddie.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user3Profile = {
    bio:
      'Most of my experience is in software development. I would enjoy collaborating with other developers to try to learn additional technologies. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra. Aenean tortor urna, consectetur varius mauris sit amet, sodales maximus nisl. Nam dictum orci id vestibulum imperdiet.',
    skills: 'JavaScript, Ruby, Rails, Angular',
  };

  const user4 = {
    firstName: 'Mark',
    lastName: 'Smith',
    username: 'Marky',
    email: 'mark@mark.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user4Profile = {
    bio:
      'I am passionate about software development and working on a software development team. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra. Aenean tortor urna, consectetur varius mauris sit amet, sodales maximus nisl. Nam dictum orci id vestibulum imperdiet.',
    skills: 'HTML, CSS, JavaScript, React, Node.js, SQL',
  };

  const user5 = {
    firstName: 'Trevor',
    lastName: 'Trent',
    username: 'TrevTren',
    email: 'trevor@trevor.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user5Profile = {
    bio:
      'I am new to web development but have a background in systems engineering. I am looking to find people to learn with by working on side projects. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra.',
    skills: 'HTML, CSS, JavaScript',
  };

  const user6 = {
    firstName: 'Melissa',
    lastName: 'Roney',
    username: 'Mel892',
    email: 'mel@mel.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user6profile = {
    bio:
      'I am a bootcamp student looking to expand my technical expertise. Leave me a comment if you would like to work with me on any projects. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra.',
    skills: 'JavaScript, PHP, Laravel, Python, Django',
  };

  const user7 = {
    firstName: 'Jeremy',
    lastName: 'Jones',
    username: 'JerJones',
    email: 'jeremy@jeremy.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user7profile = {
    bio:
      'Leave me a comment if you would like to work with me on any projects. I am interested in working on a variety of open source projects. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra.',
    skills: 'JavaScript, Ruby, Rails, Postgres, MySQL',
  };

  const user8 = {
    firstName: 'Jeff',
    lastName: 'Molar',
    username: 'Jeff761',
    email: 'jeff@jeff.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user8profile = {
    bio:
      'I have a lot of database experience and would like to collaborate on some projects. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra.',
    skills: 'Python, C, Regular Expressions, Postgres, MySQL',
  };

  const user9 = {
    firstName: 'John',
    lastName: 'Melon',
    username: 'JohnM',
    email: 'john@john.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user9profile = {
    bio:
      'My previous experience is in database management, but I am looking to get into front end web development. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra.',
    skills: 'Regular Expressions, Postgres, MySQL, MongoDB',
  };

  const user10 = {
    firstName: 'Natalie',
    lastName: 'Monarch',
    username: 'Nat44',
    email: 'natalie@natalie.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user10profile = {
    bio:
      'I am an experienced web developer working on personal projects. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra.',
    skills:
      'HTML, CSS, Sass, Node.js, JavaScript, Regular Expressions, Express, Python, MySQL',
  };

  const user11 = {
    firstName: 'George',
    lastName: 'Telk',
    username: 'Telky',
    email: 'george@george.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user11profile = {
    bio:
      'I am new to software development, but I have a lot of previous experience in project management. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra.',
    skills: 'HTML, CSS, Sass, JavaScript',
  };

  const user12 = {
    firstName: 'Jack',
    lastName: 'Harrison',
    username: 'Jacky',
    email: 'jack@jack.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user12profile = {
    bio:
      'I would like to collaborate with other developers on a variety of projects. I have project management and web development experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra.',
    skills: 'HTML5, CSS, JavaScript, C#, Postgres',
  };

  const user13 = {
    firstName: 'Nicole',
    lastName: 'Wright',
    username: 'Nicky24',
    email: 'nicole@nicole.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user13profile = {
    bio:
      'I am working on a variety of personal projects and am open to collaborating with other developers. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra.',
    skills: 'HTML, MySQL, MongoDB, React, React Native, Angular',
  };

  const user14 = {
    firstName: 'Jacob',
    lastName: 'Powell',
    username: 'Jacob2',
    email: 'jacob@jacob.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user14profile = {
    bio:
      'I have a lot of experience managing large teams for enterprise projects. I want to get better at coding and design. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra.',
    skills: 'JavaScript, React, React Native, MongoDB, Express',
  };

  const user15 = {
    firstName: 'Karen',
    lastName: 'Bonnet',
    username: 'Karrie',
    email: 'karen@karen.com',
    password: 12345678,
    confirmPassword: 12345678,
  };

  const user15profile = {
    bio:
      'I am working on a variety of web development projects. I want to expand my knowledge of mobile development. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus porttitor odio at pharetra.',
    skills: 'JavaScript, Vue, Python, Postgres, MySQL',
  };

  const users = [
    user1,
    user2,
    user3,
    user4,
    user5,
    user6,
    user7,
    user8,
    user9,
    user10,
    user11,
    user12,
    user13,
    user14,
    user15,
  ];

  users.forEach((el) => register(el));
};

//********* */
//Demo User (will be logged in when somebody clicks the Demo buttons)
//********* */
//Demo user information to intially register and later login with
const demoUserInfo = {
  firstName: 'Jamie',
  lastName: 'Demo',
  username: 'DemoJamie',
  email: 'jamie@demo.com',
  password: 11111111,
  confirmPassword: 11111111,
};

//Demo profile information to populate
const demoProfileInfo = {
  bio:
    'I am an experienced full stack web developer working on a variety of personal projects. I would enjoy collaborating with other developers. Leave me a message if you would like to collaborate!',
  skills: 'HTML, CSS, JavaScript, React, Node.js, MongoDB',
};

//Demo profile comments to populate
const comment1 =
  'Collaborate? Do you want to collaborate? If so, leave a comment on my profile. I have a few projects that might be interesting to you.';
const comment2 =
  'Database experience. I am trying to find somebody to collaborate with who has a lot of database experience. Would you be interested in working with me on a few projects?';
const comment3 =
  'I see that you work with MongoDB. Did you find that difficult to learn? Do you have any resources that you would recommend?';
const comment4 =
  'React vs. Angular. I see that you are a React developer. Have you tried working in Angular at all? I am curious what led you to React vs. Angular.';

//Demo projects to populate

//********* */
//PROJECT 1
//********* */
const project1 = {
  name: 'Flash Card Game',
  description:
    'A JavaScript flash card game that allows you to learn and practice vocabulary words in a variety of languages. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis mi ante. Fusce vulputate augue in diam vehicula, vel tempor urna faucibus. Aliquam ac pellentesque odio. Nam venenatis elementum arcu, euismod finibus sem condimentum eu. Suspendisse blandit nec quam vel eleifend. Curabitur arcu leo, bibendum id gravida sit amet, faucibus a urna. Suspendisse vitae fermentum metus.',
  targetCompletionDate: 11 / 16 / 2020,
  repoLink: '',
  liveLink: '',
  techStack: 'HTML, CSS, JavaScript',
};

//Demo tickets to populate for Project 1. Assign to a variety of developers so that you can see developers listed under the project.
const ticket1 = {
  title: 'Add styling',
  type: 'Task',
  description: 'Select a color palette and add styling with CSS',
  priority: 'High',
  dateDue: 10 / 2 / 2020,
  assignedDeveloper: 'Sammy',
};
const ticket2 = {
  title: 'Token expiration',
  type: 'Bug',
  description: 'Update the token expiration to an acceptable timeframe',
  priority: 'Critical',
  dateDue: 10 / 12 / 2020,
  assignedDeveloper: 'Mary78',
};

const ticket3 = {
  title: 'Brainstorm Teams',
  type: 'Other',
  description:
    'Begin to brainstorm and diagram how teams could be implemented for users within the application',
  priority: 'Low',
  dateDue: 10 / 26 / 2020,
  assignedDeveloper: 'DemoJamie',
};

const ticket4 = {
  title: 'Test User Registration',
  type: 'Task',
  description: 'Set up tests for user registration features',
  priority: 'Medium',
  dateDue: 10 / 30 / 2020,
  assignedDeveloper: 'DemoJamie',
};

const ticket5 = {
  title: 'Test User Login',
  type: 'Task',
  description: 'Set up tests for user login features',
  priority: 'Medium',
  dateDue: 10 / 30 / 2020,
  assignedDeveloper: 'Jeff',
};

//Demo sprints to populate for Project 1
const sprint1 = {
  title: 'UI Design',
  description:
    'This sprint will focus on designing and building out the UI for the application.',
};

const sprint2 = {
  title: 'User Authentication',
  description:
    'This sprint will focus on the logic for user login and registration.',
};

const sprint3 = {
  title: 'Testing',
  description: 'This sprint will focus on preliminary application testing.',
};

//********* */
//PROJECT 2
//********* */

const project2 = {
  name: 'Bug Tracker',
  description: 'A React project management and issue tracking application.',
  targetCompletionDate: 12 / 15 / 2020,
  repoLink: '',
  liveLink: '',
  techStack: 'HTML, CSS, React, MongoDB, Node.js, Express',
};

//Demo tickets to populate for Project 2. Assign to a variety of developers so that you can see developers listed under the project.
const ticket1 = {
  title: 'Add styling',
  type: 'Task',
  description: 'Select a color palette and add styling with CSS',
  priority: 'High',
  dateDue: 10 / 2 / 2020,
  assignedDeveloper: 'Maddie',
};
const ticket2 = {
  title: 'Token expiration',
  type: 'Bug',
  description: 'Update the token expiration to an acceptable timeframe',
  priority: 'High',
  dateDue: 10 / 12 / 2020,
  assignedDeveloper: 'JohnM',
};

const ticket3 = {
  title: 'Brainstorm Teams',
  type: 'Other',
  description:
    'Brainstorm and diagram how teams could be implemented for users within the application',
  priority: 'Medium',
  dateDue: 10 / 16 / 2020,
  assignedDeveloper: 'DemoJamie',
};

const ticket4 = {
  title: 'Test User Registration',
  type: 'Task',
  description: 'Set up tests for user registration features',
  priority: 'High',
  dateDue: 10 / 15 / 2020,
  assignedDeveloper: 'DemoJamie',
};

const ticket5 = {
  title: 'Test User Login',
  type: 'Task',
  description: 'Set up tests for user login features',
  priority: 'Critical',
  dateDue: 10 / 15 / 2020,
  assignedDeveloper: 'Marky',
};

const ticket6 = {
  title: 'Edit Dashboard Charts',
  type: 'Task',
  description: 'Edit charts within the dashboard to more accurately display data',
  priority: 'High',
  dateDue: 10 / 20 / 2020,
  assignedDeveloper: 'Marky',
};

//Demo sprints to populate for Project 2
const sprint1 = {
  title: 'UI Design',
  description:
    'This sprint will focus on designing and building out the UI for the application.',
};

const sprint2 = {
  title: 'User Authentication',
  description:
    'This sprint will focus on the logic for user login and registration.',
};

const sprint3 = {
  title: 'Testing',
  description: 'This sprint will focus on preliminary application testing.',
};

//********* */
//PROJECT 3
//********* */

const project3 = {
  name: 'Event Planning App',
  description:
    'A web application focused on event planning tools.',
  targetCompletionDate: 12 / 05 / 2020,
  repoLink: '',
  liveLink: '',
  techStack: 'HTML, CSS, Sass, React, Postgres',
};

//Demo tickets to populate for Project 3. Assign to a variety of developers so that you can see developers listed under the project.
const ticket1 = {
  title: 'Add calendar logic',
  type: 'Task',
  description: 'Add calendars to application',
  priority: 'High',
  dateDue: 10 / 2 / 2020,
  assignedDeveloper: 'DemoJamie',
};
const ticket2 = {
  title: 'Commenting',
  type: 'Bug',
  description: 'Fix issue so only owner of comment can delete it',
  priority: 'Critical',
  dateDue: 10 / 12 / 2020,
  assignedDeveloper: 'DemoJamie',
};

const ticket3 = {
  title: 'Brainstorm Chat',
  type: 'Other',
  description:
    'Brainstorm and research how to add a chat feature to the application',
  priority: 'Low',
  dateDue: 10 / 26 / 2020,
  assignedDeveloper: 'Nat44',
};

const ticket4 = {
  title: 'Test Forum',
  type: 'Task',
  description: 'Set up tests for forum features',
  priority: 'Medium',
  dateDue: 10 / 30 / 2020,
  assignedDeveloper: 'Jacky',
};

//Demo sprints to populate for Project 2
const sprint1 = {
  title: 'New Features',
  description:
    'This sprint will focus on designing and building out the newest features in the backlog.',
};

const sprint2 = {
  title: 'Authentication',
  description:
    'This sprint will focus on refining the logic for user login and registration.',
};

const sprint3 = {
  title: 'Chat',
  description: 'This sprint will focus on the application chat functionality.',
};

//********* */
//PROJECT 4
//********* */

const project4 = {
  name: 'Movie Search',
  description:
    'React application to search for movies and get recommendations.',
  targetCompletionDate: 1 / 25 / 2021,
  repoLink: '',
  liveLink: '',
  techStack: 'HTML, CSS, React, MongoDb, Express, Node.js',
};

//Demo tickets to populate for Project 4. Assign to a variety of developers so that you can see developers listed under the project.
const ticket1 = {
  title: 'Database setup',
  type: 'Task',
  description: 'Set up database connection and models',
  priority: 'High',
  dateDue: 10 / 26 / 2020,
  assignedDeveloper: 'Jacob2',
};
const ticket2 = {
  title: 'JWT',
  type: 'Bug',
  description: 'Fix bug with token expiration timeframe',
  priority: 'Critical',
  dateDue: 10 / 12 / 2020,
  assignedDeveloper: 'DemoJamie',
};

const ticket3 = {
  title: 'Admin Dashboard',
  type: 'Task',
  description:
    'Create basic admin dashboard to be used throughout development as well as in production',
  priority: 'Low',
  dateDue: 10 / 30 / 2020,
  assignedDeveloper: 'DemoJamie',
};

const ticket4 = {
  title: 'Test User Auth',
  type: 'Task',
  description: 'Set up tests for user registration and login features',
  priority: 'Medium',
  dateDue: 10 / 30 / 2020,
  assignedDeveloper: 'Karrie',
};

const ticket5 = {
  title: 'Notification system',
  type: 'Task',
  description: 'Set up notification system so users are notified when messages are received',
  priority: 'High',
  dateDue: 10 / 30 / 2020,
  assignedDeveloper: 'Mel892',
};

//Demo sprints to populate for Project 2
const sprint1 = {
  title: 'Database Tasks',
  description:
    'This sprint will focus on designing and building the database.',
};

const sprint2 = {
  title: 'User Authentication',
  description:
    'This sprint will focus on the logic for user login and registration.',
};

const sprint3 = {
  title: 'Testing',
  description: 'This sprint will focus on preliminary application testing.',
};
