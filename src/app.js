const express = require('express');
const mongoose = require('mongoose');
require('./db');
const User = mongoose.model('User');
const TaskList = mongoose.model('TaskList');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const { count } = require('console');

const app = express();



app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '100yds91.44m',
    resave: false,
    saveUninitialized: true,
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(User.authenticate()));

//serialize/deserialize users
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

const port = 3000;

app.get('/api/get_task_lists', (req, res) => {
    TaskList.find({'user': req.user._id}, (err, results) => {
        res.json({err,results});
    })
})

app.post('/api/create_new_list', (req, res) => {
    let newList = new TaskList({
        '_id': mongoose.Types.ObjectId(),
        'user': req.user._id,
        'listName': req.body.listName
    })

    TaskList.create(newList, (err, newList) => {
        if(err){
            console.log(err);
        }
        console.log("works");
        res.json({err, newList});
    })
})

app.post('/api/add_task', (req, res) => {
    const currUser = User.findOne({'username': req.user.username});
    currUser
        .then((result) => {
            console.log(result._id);
        })
})

app.get('/', (req, res) => {
    console.log(req.isAuthenticated());
    res.render('index', {user: req.user});
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/login'}), (req, res) => {
    console.log("works");
    res.redirect(`${req.user.username}`);
})

app.get('/register', (req, res) => {
    
    res.render('register');
})

app.post('/register', (req, res) => {
    console.log("registering user")
    console.log(req.body.username);
    User.register(new User(
        {_id: mongoose.Types.ObjectId(), 
        username: req.body.username, 
        email: req.body.email,}), req.body.password, (err) => {
        if (err) {
          console.log('username exists');
          return res.render('register');
        }
    
        console.log('user registered!');
        passport.authenticate("local")(req, res, function(){
            // console.log(req.user);
            res.redirect(`/${req.user.username}`);});
      });
})

app.get('/:username', isLogged, (req, res) => {
    // console.log(req.user);
    res.render('users', {user: req.user})
})

function isLogged(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}


app.listen(port, () => {console.log(`Server is listening on ${port}`)});