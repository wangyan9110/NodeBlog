/**
 * @author yywang
 */
module.exports = function(name) {
    return function(req, res, next) {
       // req.session = req.signedCookies[name] || {};

//    //    res.on('header', function(){
//            res.signedCookie(name, req.session, { signed: true });
//        });
        var error = req.flash('error');
        console.log(error);
       // var success = req.flash('success');
        res.locals.error=error.length ? error : null;
        next();
    }
}