var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    //res.render('ques', { title: 'Express' });
    if (req.cookies.username) {
        if (req.cookies.score >= 0)
            res.locals.score = req.cookies.score;
        else
            res.locals.score = -1;
        res.render('ques');
    } else {
        res.redirect('/');
    }
});

router.post('/', function (req, res) {

    var t1 = req.body.t1,
        t2 = req.body.t2,
        t3 = req.body.t3,
        t4 = req.body.t4,
        t5 = req.body.t5;

    //B B B A ABD
    var score = 100;
    if (t1 != 'B')
        score = score - 20;
    if (t2 != 'B')
        score = score - 20;
    if (t3 != 'B')
        score = score - 20;
    if (t4 != 'A')
        score = score - 20;
    if (t5 != 'ABD')
        score = score - 20;

    res.cookie("score", score, { maxAge: 6 * 1000 });
    res.redirect('/ques')

});

module.exports = router;
