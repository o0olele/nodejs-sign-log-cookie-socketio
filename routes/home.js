var express = require('express');
var fs = require('fs');
var router = express.Router();

function updateJson(email, callback) {
    //现将json文件读出来 
    fs.readFile('./user.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var users = data.toString();
        //将二进制的数据转换为字符串 
        users = JSON.parse(users);
        //将字符串转换为json对象 
        var t = 0;

        for (var i = 0; i < users.total; i++) {
            console.log(users.user[i].name);
            if (users.user[i].email == email) {
                users.user[i].count = parseInt(users.user[i].count) + 1;
                t = users.user[i].count;
            }
        }

        console.log(users.user);
        var str = JSON.stringify(users);
        //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中 
        fs.writeFile('./user.json', str, function (err) {
            if (err) { console.error(err); }
            console.log('----------更新成功-------------');
        })

        callback(err, t);
    })
}

/* GET home page. */
router.get('/', function (req, res) {

    updateJson(req.cookies.username, function (err, count) {
        res.cookie("logcount", count, { maxAge: 14 * 24 * 60 * 60 * 1000 });
        res.locals.username = req.cookies.username;
        res.locals.logcount = count;
        res.render('home', { title: 'Express' });
    })

});


module.exports = router;
