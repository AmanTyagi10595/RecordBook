const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Error = require('./error/error');

// set up express app
const app = express();

// connect to mongodb
mongoose.connect('mongodb://localhost/AssetsManag');
mongoose.Promise = global.Promise;

// use body-parser middleware

app.use(bodyParser.json());
app.use(require('body-parser').urlencoded({ extended: true }));
// initialize routes

app.use('/building', require('./routes/Building'));

// error handling middleware
app.use(function (err, req, res, next) {
    console.log("Error:", err.message); // to see properties of message in our console
    res.status(err.status).send({ error: err.message });
});

// listen for requests
app.listen(process.env.port || 4000, function () {
    console.log('listening at 4000');
});
