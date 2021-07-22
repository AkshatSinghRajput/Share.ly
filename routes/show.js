const router = require('express').Router();
const File = require('../models/file');
const User = require('../schema/user');

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        return res.redirect('/login');
    }
}
// try{
//     const file = await File.findOne({uuid: req.params.uuid});
//     if(!file){
//         console.log(err);
//         res.render('download');
//     }
//     else{
//         res.render('download',{
//             uuid:file.uuid,
//             fileName:file.filename,
//             fileSize:file.size,
//             download: "https://localhost:3000/files/download/"+`${file.uuid}`
//         });
//     }
// }
// catch(err){
//    console.log(err);
//    res.render('download');
// }

// router.get('/',(req,res)=>{
//     res.render('download');
// })

router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) {
            console.log('File not found!');
            res.render('download');
        }
        else {
            res.render('download', {
                uuid: file.uuid,
                fileName: file.filename,
                fileSize: file.size,
                download: "http://localhost:3000/files/download/" + `${file.uuid}`,
                name: req.user.name,
            });
        }
    }
    catch (err) {
        console.log(err);
        res.render('download');
    }
});

module.exports = router;