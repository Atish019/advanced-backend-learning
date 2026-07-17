const net = require('net');

const server = net.createServer((socket) => {
  console.log('Client connected');
  socket.on('data', (data) => {
    console.log('Server received:', data.toString());
    socket.write('Hello from server');
  });
  socket.on('end', () => console.log('Client disconnected'));
});

server.listen(9000, () => console.log('Server listening on port 9000'));
