const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
        console.log("error");
        return res.render('download');
    }
    const filePath = `${__dirname}/../${file.path}`;
    if (res.download(filePath)) {
        res.redirect("/uploads");
    }
})
module.exports = router;