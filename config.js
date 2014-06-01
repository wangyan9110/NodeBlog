/**
 * 配置文件
 * @author yywang
 */

//端口
exports.port=3000;

//数据库配置
exports.db={
        host:"localhost",
        user:"root",
        password:"123456",
        database:"blogs",
        //最大连接数
        connectionLimit:15,
        //最小连接数
        waitForConnections:2,
        //最大的请求队列，0表示不限制
        queueLimit:0
};

//管理员用户配置
exports.user={
    //经过sha1加密
    userName:'d033e22ae348aeb5660fc2140aec35850c4da997',
    password:'7c4a8d09ca3762af61e59520943dc26494f8941b',
    name:'王岩'
}

//博客配置
exports.blog={
    name:'简单'
}
