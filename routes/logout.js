var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {

    if (req.cookies.username) {
        res.locals.username = req.cookies.username;
        res.clearCookie("username");
        res.clearCookie("logcount");
        res.redirect('/');

    }
});

module.exports = router;