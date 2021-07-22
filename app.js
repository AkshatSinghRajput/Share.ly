// require moules
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require("express-session");
const bcrypt = require('bcrypt');

const app = express();

const dotenv = require('dotenv');
dotenv.config({ path: './.env' })

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
// connecting with database with mongoose
require('./Config/db');
// session middleware 
app.use(session({
    secret: "qYtC`[#CnG2bRkJ+h9KxEZs$S$mS\t};7%f[pA-kr{'(/`r%\3",
    resave: false,
    saveUninitialized: true
}));


// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error = req.flash('error');
    next();
})

// Passport Authentication

const localStrategy = require('passport-local').Strategy;
const User = require('./schema/user');

passport.use(new localStrategy({ usernameField: 'email' }, (username, password, done) => {
    User.findOne({ email: username }, (err, found) => {
        if (err) throw err;
        if (!found) {
            return done(null, false, { message: 'User not found!' });
        }

        bcrypt.compare(password, found.password, (err, result) => {
            if (err) return done(null, false);
            if (!result) return done(null, false, { message: 'Password is incorrect!' });
            if (result) return done(null, found);
        })
    })
}))

// Serializing and Deserializing User

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});

// displaying register page on home route with express
app.use('/', require('./routes/LandingPage'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/uploads', require('./routes/done'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));
app.use('/decrypter', require('./routes/decrypt'));
app.use('/error', require('./routes/404_error'));

// making a port where our website listen using express

let Port = process.env.PORT || 3000;

app.listen(Port, () => {
    console.log("Server is listining on port 3000!");
});