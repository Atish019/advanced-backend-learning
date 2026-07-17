const dns = require('dns');

dns.lookup('www.example.com', (err, address, family) => {
  if (err) return console.error(err);
  console.log('Address:', address, 'Family:', family);
});
