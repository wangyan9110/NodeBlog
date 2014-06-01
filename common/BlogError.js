/**
 *
 * //自定义异常类，需要增加完善日志记录。
 * @author yywang
 */
var util = require('util');

var AbstractError = function (msg, constr) {
    Error.captureStackTrace(this, constr || this);
    this.message = msg || 'Error';
    this.type='sys';
};

util.inherits(AbstractError,Error);
AbstractError.prototype.name='Abstract Error';

var SystemError=function(msg){
    SystemError.super_.call(this,msg,this.constructor);
};

util.inherits(SystemError,AbstractError);
SystemError.prototype.message='System Error';

var BizError=function(msg,constr){
    Error.captureStackTrace(this,constr||this);
    this.message=msg||'Error';
    this.type='biz';
};
util.inherits(BizError,Error);
BizError.prototype.message='Biz Error';

exports.SystemError=SystemError;
exports.BizError=BizError;