const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Admin = require('./models/Admin');
const Tenant = require('./models/Tenant');

const checkAndCreateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gym');
        console.log('✅ Connected to MongoDB');

        // Create a default tenant if it doesn't exist
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
            console.log('✅ Default tenant created.');
        }

        const email = 'techvaseegrah@gmail.com';
        const password = '123456';

        let admin = await Admin.findOne({ email });
        
        if (admin) {
            console.log('✅ Admin user already exists:', email);
            console.log('   Role:', admin.role);
            console.log('   Created:', admin._id);
        } else {
            console.log('⚠️  Admin user does not exist. Creating...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            admin = new Admin({
                email,
                password: hashedPassword,
                role: 'admin',
                tenant: tenant._id
            });

            await admin.save();
            console.log('✅ Admin user created successfully!');
            console.log('   Email:', email);
            console.log('   Password:', password);
        }

        const allAdmins = await Admin.find({});
        console.log('\n📋 All Admin Users:');
        allAdmins.forEach((admin, index) => {
            console.log(`   ${index + 1}. ${admin.email} (${admin.role})`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('\n🔚 Database connection closed');
    }
};

checkAndCreateAdmin();