const express = require('express');

const app = express();

const fileServerMiddleware = express.static('public');

app.use('/', fileServerMiddleware);

app.listen(3001, function() {
    console.log('App started on port 3001')
});
