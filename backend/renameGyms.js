const mongoose = require('mongoose');
require('dotenv').config();
const Tenant = require('./models/Tenant');

const renameGyms = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gym');
        console.log('✅ Connected to MongoDB');

        // Rename kgf to gym1
        let kgfTenant = await Tenant.findOne({ name: 'kgf' });
        if (kgfTenant) {
            kgfTenant.name = 'gym1';
            kgfTenant.slug = 'gym1';
            await kgfTenant.save();
            console.log('✅ Renamed "kgf" to "gym1"');
        } else {
            console.log('ℹ️  "kgf" tenant not found');
        }

        // Rename vadamalai to gym2
        let vadamalaiTenant = await Tenant.findOne({ name: 'vadamalai' });
        if (vadamalaiTenant) {
            vadamalaiTenant.name = 'gym2';
            vadamalaiTenant.slug = 'gym2';
            await vadamalaiTenant.save();
            console.log('✅ Renamed "vadamalai" to "gym2"');
        } else {
            console.log('ℹ️  "vadamalai" tenant not found');
        }

        // List all tenants to verify changes
        const allTenants = await Tenant.find({}).select('name slug');
        console.log('\n📋 All Tenants:');
        allTenants.forEach((tenant, index) => {
            console.log(`   ${index + 1}. ${tenant.name} (${tenant.slug})`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('\n🔚 Database connection closed');
    }
};

renameGyms();