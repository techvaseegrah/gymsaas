const mongoose = require('mongoose');
const Fighter = require('../models/Fighter');
const Tenant = require('../models/Tenant');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateBatchNumbers = async () => {
  try {
    console.log('Starting batch number update...');
    
    // Get all fighters with ASHURA batch numbers
    const fighters = await Fighter.find({ fighterBatchNo: /^ASHURA-/ });
    console.log(`Found ${fighters.length} fighters with ASHURA batch numbers`);
    
    let updatedCount = 0;
    
    for (const fighter of fighters) {
      try {
        // Get the tenant for this fighter
        const tenant = await Tenant.findById(fighter.tenant);
        if (!tenant) {
          console.log(`Skipping fighter ${fighter._id} - no tenant found`);
          continue;
        }
        
        // Extract the random part from the old batch number
        const oldBatchNumber = fighter.fighterBatchNo;
        const randomPart = oldBatchNumber.split('-')[1];
        
        // Create new batch number with gym name prefix
        const gymPrefix = tenant.name.replace(/\s+/g, '').toUpperCase();
        const newBatchNumber = `${gymPrefix}-${randomPart}`;
        
        // Update the fighter's batch number
        fighter.fighterBatchNo = newBatchNumber;
        await fighter.save();
        
        console.log(`Updated fighter ${fighter._id}: ${oldBatchNumber} -> ${newBatchNumber}`);
        updatedCount++;
      } catch (error) {
        console.error(`Error updating fighter ${fighter._id}:`, error.message);
      }
    }
    
    console.log(`Successfully updated ${updatedCount} fighters`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
};

updateBatchNumbers();