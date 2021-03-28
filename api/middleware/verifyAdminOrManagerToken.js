const jwt = require('jsonwebtoken');
const Project = require('../models/Project');

module.exports = async function(req, res, next, project) {
  //Get token from header
  const token = req.header('x-access-token');

  //If there is no token, return error
  if (!token) {
    return res.status(401).json({ msg: 'Access denied' });
  }
  try {
    //If there is a token, verify the token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded.user;

    //If the user is not an admin or the manager for the project, deny access.
    if (
      req.user.role === 'admin' ||
      project.manager.toString() === req.user.id
    ) {
      next();
    } else {
      return res
        .status(401)
        .json({ msg: 'You are not permitted to perform this action.' });
    }
  } catch (err) {
    //If there is a token but it isn't valid, send error
    res.status(401).json({ msg: 'Invalid token' });
  }
};
