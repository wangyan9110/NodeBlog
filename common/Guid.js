/**
 * @author yywang
 */

var guid = require('easy-guid');

exports.guid=function(){
    return guid.new(32);
}