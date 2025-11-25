const Admin = require('../models/Admin');

const isSuperAdmin = async (req, res, next) => {
  try {
    // Get the admin user from the database
    const admin = await Admin.findById(req.user.id);

    // Check if the user is a superadmin
    if (admin && admin.role === 'superadmin') {
      next();
    } else {
      res.status(403).json({ msg: 'Access denied. Superadmin rights required.' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = isSuperAdmin;