var express = require('express');
var crypto = require('crypto');
var fs = require('fs');
var router = express.Router();

function writeJson(params) {
    //现将json文件读出来 
    fs.readFile('./user.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var users = data.toString();
        //将二进制的数据转换为字符串 
        users = JSON.parse(users);
        //将字符串转换为json对象 
        users.user.push(params);
        //将传来的对象push进数组对象中 
        users.total = users.user.length;
        //定义一下总条数，为以后的分页打基础 
        console.log(users.user);
        var str = JSON.stringify(users);
        //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中 
        fs.writeFile('./user.json', str, function (err) {
            if (err) { console.error(err); }
            console.log('----------新增成功-------------');
        })
    })
}

function checkJson(email, callback) {

    fs.readFile('./user.json', function (err, data) {
        isTrue = true;
        if (err) {
            return false;
        }
        var users = data.toString();
        //将二进制的数据转换为字符串 
        users = JSON.parse(users);
        //将字符串转换为json对象 

        users.total = users.user.length;
        //定义一下总条数，为以后的分页打基础 
        console.log("------------find-----------" + email);
        for (var i = 0; i < users.total; i++) {
            console.log(users.user[i].email);
            if (users.user[i].email == email)
                isTrue = false;
        }
        callback(err, isTrue);
    })
}


/* GET home page. */
router.get('/', function (req, res) {
    res.render('signup', { title: 'sign' });
});

router.post('/', function (req, res) {
    var
        userEmail = req.param('regEmail'),
        userName = req.param('regName'),
        userPwd = req.param('regPwd'),
        userRepwd = req.param('regRepwd'),
        userRName = req.param('regRealName'),
        userTel = req.param('regTel'),
        userBirth = req.param('regBirth');

    var md5 = crypto.createHash('md5');
    var en_Pwd = md5.update(userPwd).digest('hex');
    var md5 = crypto.createHash('md5');
    var en_Repwd = md5.update(userRepwd).digest('hex');

    var data = {
        "email": userEmail,
        "name": userName,
        "rname": userRName,
        "birth": userBirth,
        "tel": userTel,
        "pwd": en_Pwd,
        "count":0
    };

    checkJson(userEmail, function (err, isTrue) {
        if (isTrue) {
            writeJson(data);
            console.log('注册名:' + userName);
            console.log('注册邮箱:' + userEmail);
            console.log('注册密码:' + en_Pwd);
            console.log('确认密码:' + en_Repwd);

            res.cookie("username", userEmail, { maxAge: 14 * 24 * 60 * 60 * 1000 });
            res.cookie("logcount", 1, { maxAge: 14 * 24 * 60 * 60 * 1000 });
            res.redirect('/');
        } else {
            res.locals.error = "邮箱已被注册！";
            res.render('signup')
        }
    })

});

module.exports = router;
