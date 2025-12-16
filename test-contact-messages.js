const axios = require('axios');

// Test the super admin contact messages endpoint
async function testContactMessages() {
    try {
        const response = await axios.get('http://localhost:5002/api/contact/superadmin/messages');
        console.log('Messages:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testContactMessages();