/**
 * @author yywang
 */

var blog=require('../config').blog;
var bizError = require('../common/BlogError').BizError;
var sysError = require('../common/BlogError').SystemError;

module.exports = function(name) {
    return function(req, res, next) {
        var error = req.flash('error');
        var success=req.flash('success');
        if(error.length){
            console.error(error);
            if(error[0].type&&error[0].type=='biz' ){
                res.locals.error=error[0].message;
            }else{
                res.locals.error='系统错误，请稍后再试。';
            }
        }else{
            res.locals.error= null;
        }
        res.locals.success=success.length?success:null;
        res.locals.blogName=blog.name;
        if(req.session.error){
            res.locals.error=req.session.error;
            req.session.error=null;
        }
        next();
    }
}