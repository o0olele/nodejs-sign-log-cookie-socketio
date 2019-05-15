var express = require('express');
var router = express.Router();
var fs = require('fs');
var crypto = require('crypto');

function checkJsonLog(name, pwd, callback) {

  fs.readFile('./user.json', function (err, data) {
    isTrue = false;
    if (err) {
      return false;
    }
    var users = data.toString();
    //将二进制的数据转换为字符串 
    users = JSON.parse(users);
    //将字符串转换为json对象 

    for (var i = 0; i < users.total; i++) {
      console.log(users.user[i].name);
      if (users.user[i].email == name && users.user[i].pwd == pwd)
        isTrue = true;
    }
    callback(err, isTrue);
  });
}

/* GET home page. */
router.get('/', function (req, res) {
  if(req.cookies.username){
    
    res.redirect('/home');
  }else{
    res.locals.error=req.cookies.error;
    res.render('index', { title: 'Express' });
  }
  
});

router.post('/', function (req, res) {

  var email = req.param("Email"),
    pwd = req.param("Pwd");

  var md5 = crypto.createHash('md5');
  var en_Pwd = md5.update(pwd).digest('hex');

  checkJsonLog(email, en_Pwd, function (err, isTrue) {
    if (isTrue) {
      console.log("---------------------");
      res.cookie("username", email, { maxAge: 14 * 24 * 60 * 60 * 1000 });
      res.cookie("logcount", 1, { maxAge: 14 * 24 * 60 * 60 * 1000 });
      res.redirect('/home');
    } else {
      res.cookie("error","用户名或密码错误！",{maxAge: 5 * 1000 });
      res.redirect("/");
      
    }
  
  });

});

module.exports = router;
