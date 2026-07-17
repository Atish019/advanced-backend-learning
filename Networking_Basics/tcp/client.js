const net = require('net');

const client = net.createConnection({ port: 9000 }, () => {
  console.log('Connected to server');
  client.write('Hello from client');
});

client.on('data', (data) => {
  console.log('Client received:', data.toString());
  client.end();
});

client.on('end', () => console.log('Disconnected from server'));
