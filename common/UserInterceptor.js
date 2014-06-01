/**
 * @author yywang
 */

module.exports = function(name) {
    return function(req, res, next) {
        var user = req.session.user;
        res.locals.user=user ? user : null;
        next();
    }
}