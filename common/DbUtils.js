/**
 * @author yywang
 */

var mysql = require('mysql');
var config = require('../config');

var pool=null;

function createPool(){
    if(!pool){
        pool = mysql.createPool({
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            database:config.db.database,
            charset:'UTF8_UNICODE_CI',
            waitForConnections: config.db.waitForConnections,
            connectionLimit: config.db.connectionLimit,
            queueLimit: config.db.queueLimit
        });

    }
    return pool;
}

exports.db = createPool();