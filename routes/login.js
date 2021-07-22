const router = require('express').Router();
const passport = require('passport');

// rendering the login page.
router.get('/', (req, res) => {
    res.render('login');
});

// Login process using passport.
router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/uploads',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;