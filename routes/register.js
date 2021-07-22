const router = require('express').Router();
const bcrypt = require('bcrypt');
const md5 = require('md5');
const mailsend = require('../mailsender/mailsender');

var otp;

// exporting user schema.
const User = require('../schema/user');

// rendering the register page.
router.get('/', (req, res) => {
    res.render('register');
});

// Registratin process.
router.post('/', (req, res) => {
    const { name, email, password } = req.body;
    otp = Math.floor(100000 + Math.random() * 900000);

    if (name === '' || email === '' || password === '') {
        req.flash('error', 'Please fill all the fields!')
        res.redirect('/register');
    } else {
        User.findOne({ email: email }, (err, found) => {
            if (err) {
                // here we have render a error page.
                console.log(err);
                res.redirect('/error');
            } else {
                if (found) {
                    // here we have to flash a message that user with this email already exist.
                    req.flash('error', 'User with this email already exists!') // delete this after rendering the flash message.
                    res.redirect('/register');
                } else {
                    mailsend(email, 'Your otp for registration is ' + otp);
                    req.flash('success_msg', 'Otp is sended on your email')
                    res.render('realOtp');
                    router.post('/otp', (req, res) => {
                        if (req.body.otp == otp) {
                            // here we have to write a code to verify the email provided by the user.
                            bcrypt.hash(password, 10, (err, hash) => {
                                if (err) {
                                    // here we have to render a error page.
                                    console.log(err);
                                    res.redirect('/error');
                                } else {
                                    const u1 = new User({
                                        name: name,
                                        email: email,
                                        uniqueid: md5(name + email),
                                        password: hash
                                    });
                                    u1.save();
                                    // here we have to flash a message that user register successfully.
                                    req.flash('success_msg', 'Registered successfully!') // delete this after rendering the flash message
                                    res.redirect('/login');
                                }
                            });
                        } else {
                            req.flash('error', 'Otp is wrong try again!');
                            res.redirect('/register');
                        }
                    })
                    // // here we have to write a code to verify the email provided by the user.
                    // bcrypt.hash(password, 10, (err, hash) => {
                    //     if (err) {
                    //         // here we have to render a error page.
                    //         console.log(err);
                    //         res.redirect('/error');
                    //     } else {
                    //         const u1 = new User({
                    //             name: name,
                    //             email: email,
                    //             uniqueid: md5(name + email),
                    //             password: hash
                    //         });
                    //         u1.save();
                    //         // here we have to flash a message that user register successfully.
                    //         req.flash('success_msg', 'Registered successfully!') // delete this after rendering the flash message
                    //         res.redirect('/login');
                    //     }
                    // });
                }
            }
        });
    }

});

module.exports = router;