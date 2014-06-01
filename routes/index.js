/**
 * Created by wangyan on 14-5-1.
 */
var bizError = require('../common/BlogError').BizError;

exports.login=function(req,res){
    res.render('login');
}

exports.loginAction=function(req,res){
    var userName=req.body['userName'];
    var password=req.body['password'];
    if(userName==''||password==''){
        req.flash('error',new bizError('用户名密码不能为空.'));
        return res.redirect('/login');
    }
    var sha1=require('../common/EncryptUtils').sha1;
    var user=require('../config').user;
    if(sha1(userName)!=user.userName||sha1(password)!=user.password){
        req.flash('error',new bizError('用户名或密码错误.'));
        return res.redirect('/login');
    }
    req.session.user={userName:userName,name:user.name};
    res.redirect('/');
}