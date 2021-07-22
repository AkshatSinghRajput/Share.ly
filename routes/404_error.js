const router = require('express').Router();

router.get('/', (req,res) => {
    res.render('404_error');
})

module.exports = router;