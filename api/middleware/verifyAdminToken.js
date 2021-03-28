const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header('x-access-token');

    //If there is no token, return error
    if(!token) {
        return res.status(401).json({ msg: 'Access denied' });
    }
    try {
        //If there is a token, verify the token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded.user;
        if (!req.user.role === 'admin') {
            return res.status(401).json({ msg: 'You are not permitted to perform this action.' })
        } else {
        next();
        }
    } catch(err) {
        //If there is a token but it isn't valid, send error
        res.status(401).json({ msg: 'Invalid token' });
    }   
}