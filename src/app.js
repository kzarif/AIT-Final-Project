const express = require('express');
const mongoose = require('mongoose');

require('./db');
const User = mongoose.model('User');

const session = require('express-session');
const bodyParser = require('body-parser');

const passport = require('passport');
const bcrypt = require('bcrypt');
const path = require('path');

const { count } = require('console');

const app = express();

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

const port = 3000;

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    
    res.render('register');
})

app.listen(port, () => {console.log(`Server is listening on ${port}`)});