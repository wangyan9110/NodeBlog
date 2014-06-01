/**
 * @author yywang
 */

var db=require('../common/DbUtils').db;
var bizError=require('../common/BlogError').BizError;

function Category(category){
    this.id=category.id;
    this.title=category.title;
    this.desc=category.desc;
    this.postsCount=category.postsCount;
    this.createTime=category.createTime;
}

/**
 * 保存类别
 * @param category 类别
 */
Category.prototype.save=function(category,callback){

}

/**
 * 获取类型
 * @param id 类型id
 * @param callback 类型callback
 */
Category.get=function(id,callback){
    var sql="select * from categorys where id=?";
    var values=[id];
    db.query(sql,values,function(error,rows){
        if(error){
            callback(error,null);
        }
        if(rows.length>0){
            callback(null,new Category(rows[0]));
        }else{
            callback(new bizError('该id已经不存在。'),null);
        }
    });
}

/**
 * 根据ids获取值
 * @param ids 获取ids
 * @param callback call
 */
Category.getByIds=function(ids,callback){
    var sql="select * from categorys where id in (?)";

    var values=[typeof ids=='array'?ids.join(','):ids];
    db.query(sql,values,function(error,rows){
        if(error){
            callback(error,null);
        }
        var categorys=[];
        if(rows.length>0){
            for(var index=0;index<rows.length;index++){
                categorys.push(new Category(rows[index]));
            }
        }
        callback(null,categorys);
    });
}

Category.getAll=function(callback){
    var sql="select * from categorys order by createTime desc";
    db.query(sql,function(error,rows){
        if(error){
           callback(error,null);
        }
        var categorys=[];
        if(rows.length>0){
            for(var index=0;index<rows.length;index++){
                categorys.push(new Category(rows[index]));
            }
        }
        callback(null,categorys);
    });
}


exports.Category=Category;