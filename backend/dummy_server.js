const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello from dummy Express server!');
});

app.get('/endpoint1', (req, res) => {
    res.send('Responded to Endpoint #1');
});

app.get('/endpoint2', (req, res) => {
    res.send('Responded to Endpoint #2');
});

app.listen(PORT, () => {
    console.log(`Dummy server running at http://localhost:3000`);
});