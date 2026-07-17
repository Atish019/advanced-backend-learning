const axios = require('axios');

axios.get('https://www.example.com')
  .then(res => console.log('Status:', res.status))
  .catch(err => console.error('Request failed:', err.message));
