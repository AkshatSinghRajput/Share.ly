const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('LandingPage')
})

module.exports = router;