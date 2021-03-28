import React, { useEffect, useState, Fragment, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { ProfileContext } from '../../context/profiles/ProfileContext';
import { AuthContext } from '../../context/auth/AuthContext';



//When Demo button is clicked, run the onDemoClick function to register demo user, create demo profile, create demo projects, etc
const onDemoClick = async (props) => {
    let fullId = uuidv4();
    let id = fullId.substring(0, 5);
    const demoUser = {
      firstName: 'Steven',
      lastName: 'Demo',
      username: `DemoUser${id}`,
      email: `${id}@demo.com`,
      password: '12345678',
      confirmPassword: '12345678',
      role: 'manager',
    };
    const profile = {
      bio: 'This is my bio',
      skills: 'HTML, CSS, Javascript, React, Node.js, MongoDB',
    };
    //call register and createProfile actions
    // await register(demoUser);
    // await createProfile(profile, props.history);
    // props.history.push(`/dashboard`);
  };

  export default onDemoClick;
