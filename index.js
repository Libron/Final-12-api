const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');
const gallery = require('./app/gallery');
const users = require('./app/users');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const port = 8000;

mongoose.connect(config.dbUrl, config.mongoOptions).then(() => {
    app.listen(port, () => {
        app.use('/gallery', gallery);
        app.use('/users', users);
        console.log(`Server started on ${port} port`);
    });
});