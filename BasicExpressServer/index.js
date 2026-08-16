const express = require('express');

const port = 3001;

const app = express(); // calling the express function to create an app/Server instance

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/', (req, res) => {
    res.send('Hello World! POST')
});

app.delete('/', (req, res) => {
    res.send('Hello World! DELETE')
});

app.put('/', (req, res) => {
    res.send('Hello World! PUT')
});

// Custom Route
app.post('/users', (req, res) => {
    res.send('User Created Successfully')
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});