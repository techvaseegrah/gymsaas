const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Fighter = require('../models/Fighter');
const Tenant = require('../models/Tenant');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        
        // Add tenant information to request
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};