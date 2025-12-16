const axios = require('axios');

// Test the contact form endpoint
async function testContactForm() {
    try {
        const response = await axios.post('http://localhost:5002/api/contact', {
            name: 'Test User',
            company: 'Test Company',
            email: 'test@example.com',
            phone: '+1234567890',
            message: 'This is a test message from the contact form.'
        });
        
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testContactForm();