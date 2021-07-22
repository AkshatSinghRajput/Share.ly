const path = require('path');
const multer = require('multer');
const File = require('../models/file');
const User = require('../schema/user');
const { v4: uuid4 } = require('uuid');
const router = require('express').Router();
const cryptoJs = require('crypto-js');
const secret = require('../models/secrets');
const { runInNewContext } = require('vm');
// here we have to add functionality for logout once logout button is added.

// passport middleware to check that user is authenticated or not.
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        return res.redirect('/login');
    }
}

// Multer setup.
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + `${path.extname(file.originalname)}`);
    }

})

const maxSize = 1000000 * 1000;

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");


// get route for upload page.
router.get('/', checkAuthenticated, (req, res) => {
    res.render('index', { uniqueid: req.user.uniqueid });
});

// get route for logout.
router.get('/logout', checkAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged out successfully!')
    res.redirect('/login');
});

// Uploading the file after clicking the upload button.

router.post('/', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.send(err);
            console.log(err);
            res.redirect('/error');
        }
        else {
            if (req.file) {
                const uuid = uuid4();
                const uniqueid = req.body.uniqueid;
                if (uniqueid == '') {
                    const file = new File({
                        filename: req.file.filename,
                        uuid: uuid,
                        path: req.file.path,
                        size: req.file.size,
                        uniqueid: uniqueid
                    });
                    const response = await file.save();
                    const link = 'https://localhost:3000/files/' + `${response.uuid}`;

                    res.render('filepage', {
                        ensct: cryptoJs.AES.encrypt(uuid, secret)
                    });
                } else {
                    User.findOne({ uniqueid: uniqueid }, async (err, found) => {
                        if (err) {
                            console.log(err);
                            res.redirect('/error');
                        } else {
                            if (!found) {
                                req.flash('error', 'Enter valid uniqueid!')
                                res.redirect('/uploads');
                            } else {
                                const file = new File({
                                    filename: req.file.filename,
                                    uuid: uuid,
                                    path: req.file.path,
                                    size: req.file.size,
                                    uniqueid: uniqueid
                                });
                                const response = await file.save();
                                const link = 'https://localhost:3000/files/' + `${response.uuid}`;

                                res.render('filepage', {
                                    ensct: cryptoJs.AES.encrypt(uuid, secret)
                                });
                            }
                        }
                    })
                }

                // router.post('/addid', (request, resc) => {
                //     const uniqueid = request.body.uniqueid;
                //     console.log(uniqueid);
                //     File.updateOne({ uuid: response.uuid }, { $set: { uniqueid: uniqueid } }, (err, done) => {
                //         if (err) {
                //             console.log(err);
                //             resc.redirect('/error');
                //         } else {
                //             if (!done) {
                //                 console.log('Uniqueid is not saved in the database.');
                //                 resc.redirect('/error');
                //             } else {
                //                 console.log(done);
                //                 console.log("done");
                //                 resc.redirect('/');
                //             }
                //         }
                //     })
                // });
            }
            else {
                req.flash('error', 'Please select file!');
                res.redirect('/uploads');
            }
        }
    });


});

module.exports = router;
