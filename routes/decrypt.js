const cryptoJs = require('crypto-js');
const router = require('express').Router();
const secret = require('../models/secrets');
const File = require('../models/file');

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        return res.redirect('/login');
    }
}
router.get('/', checkAuthenticated, (req, res) => {
    res.render('otp', { uniqueid: req.user.uniqueid });
});

router.post('/', (req, res) => {
    const en = req.body.encrypted;
    const uniqueid = req.body.uniqueid;
    if (en) {
        const codes = cryptoJs.AES.decrypt(en, secret);
        const originalText = codes.toString(cryptoJs.enc.Utf8);
        File.findOne({ uuid: originalText }, (err, found) => {
            if (err) {
                console.log(err);
                res.redirect('/error');
            } else {
                if (!found) {
                    req.flash('error', 'File not found!');
                    res.redirect('/decrypter');
                } else {
                    // if(uniqueid == req.user.uniqueid) {
                    //     res.redirect('/files/download/'+`${uuid}`);
                    // } else {
                    //     console.log('You are not authorized to access this file.');
                    //     res.redirect('/');
                    // }
                    if (found.uniqueid == "") {
                        res.redirect('/files/download/' + `${originalText}`);
                    }
                    else {
                        if (found.uniqueid == req.user.uniqueid) {
                            res.redirect('/files/download/' + `${originalText}`);
                        } else {
                            req.flash('error', 'You are not authenticated to access this file!')
                            res.redirect('/decrypter');
                        }
                    }
                }
            }
        });
    }
    else {
        req.flash('error', 'Enter id to decrypt!')
        res.redirect('/decrypter');
    }
});

module.exports = router;