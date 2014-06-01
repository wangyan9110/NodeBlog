/**
 * 加密算法
 * @author yywang
 */

var md5 = require('js-md5');

exports.md5=function(str){
    return md5(str);
}

var sha1=require('sha1');

exports.sha1=function(str){
    return sha1(str);
}
