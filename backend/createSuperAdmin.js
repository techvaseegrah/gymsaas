const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Tenant = require('./models/Tenant');

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully.');

    // Create a default tenant for the superadmin
    let tenant = await Tenant.findOne({ slug: 'default' });
    if (!tenant) {
      tenant = new Tenant({
        name: 'Default Gym',
        slug: 'default',
        email: 'admin@defaultgym.com',
        subscriptionPlan: 'enterprise',
        subscriptionStatus: 'active'
      });
      await tenant.save();
      console.log('Default tenant created.');
    }

    const email = 'superadmin@example.com';
    const password = 'superadmin123';

    // Check if the superadmin user already exists to avoid duplicates
    let superAdmin = await Admin.findOne({ email });
    if (superAdmin) {
      console.log('SuperAdmin user already exists.');
      return;
    }

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new superadmin user
    superAdmin = new Admin({
      email,
      password: hashedPassword,
      role: 'superadmin',
      tenant: tenant._id
    });
    await superAdmin.save();

    console.log('SuperAdmin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (err) {
    console.error('Error creating superadmin user:', err);
  } finally {
    mongoose.connection.close();
  }
};

createSuperAdmin();