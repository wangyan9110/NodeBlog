/**
 * @author yywang
 */

var db = require('../common/DbUtils').db;
var bizError = require('../common/BlogError').BizError;
var sysError = require('../common/BlogError').SystemError;

function Post(post) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.abstract = post.abstract;
    this.status = post.status;
    this.type = post.type;
    this.pageView = post.pageView ? post.pageView : 0;
    this.postedTime = post.postedTime ? post.postedTime : new Date();
    this.createTime = post.createTime ? post.createTime : new Date();
    this.url = post.url;
    this.categorys = post.categorys;
};

var PostStatus = {
    published: 'published',
    unPublished: 'unPublished',
    deleted: 'deleted',
    create: function (str) {
        if (str == 'published') {
            return PostStatus.published;
        } else if (str == 'unPublished') {
            return PostStatus.unPublished;
        } else {
            return PostStatus.deleted;
        }
    }
};

var PostType = {
    Page: 'page',
    Blog: 'blog',
    News: 'news',
    create: function (str) {
        if (str == 'page') {
            return PostType.Page;
        } else if (str == 'blog') {
            return PostType.Blog;
        } else if (str == 'news') {
            return PostType.News;
        }
    }
}

Post.prototype.save = function (callback) {
    var insertPostSql = 'insert into posts (id,title,content,abstract,url,status,type,pageView,postedTime,createTime)values(?,?,?,?,?,?,?,?,?,?)';
    var values = [this.id, this.title, this.content, this.abstract, this.url,
        this.status, this.type, this.pageView, this.postedTime ? this.pageView : new Date(), this.createTime ? this.createTime : new Date()];
    var id = this.id;
    var categorys = this.categorys;
    var type = this.type;
    db.getConnection(function (error, connection) {
        if (error) {
            callback(error,null);
        }
        connection.beginTransaction(function (error) {
            if (error) {
                callback(error,null);
            }
            connection.query(insertPostSql, values, function (error, result) {
                if (error) {
                    connection.rollback(function () {
                       callback(error,null);
                    });
                }
                if (type != PostType.Blog || categorys.length == 0) {
                    connection.commit(function (error) {
                        if (error) {
                            connection.rollback(function () {
                                callback(error,null);
                            });
                        }
                        callback(null, true);
                    });
                }
                var insertPostCategorySql = "insert into postcategory (postId,categoryId,categoryTitle)values(?,?,?)";
                var updateCategory = "update categorys set postsCount=postsCount+1 where id=?";
                for (var index = 0; index < categorys.length; index++) {
                    (function (index) {
                        var postCategoryValues = [id, categorys[index].id, categorys[index].title];
                        connection.query(insertPostCategorySql, postCategoryValues, function (error, result) {
                            if (error) {
                                connection.rollback(function () {
                                    callback(error,null);
                                });
                            }
                            var updateId = [categorys[index].id];
                            connection.query(updateCategory, updateId, function (error, result) {
                                if (error) {
                                    connection.rollback(function () {
                                        callback(error,null);
                                    });
                                }
                                if (index == categorys.length - 1) {
                                    connection.commit(function (error) {
                                        if (error) {
                                            connection.rollback(function () {
                                                callback(error,null);
                                            });
                                        }
                                        callback(null, true);
                                    });
                                }
                            })
                        });
                    })(index);
                }
            });
        });
    });
};

Post.get = function (id, callback) {
    var selectSql = "select * from posts where id=? and status!=?";
    var values = [id, PostStatus.deleted];
    db.query(selectSql, values, function (error, rows) {
        if (rows.length > 0) {
            var post = new Post(rows[0]);
            callback(null,post);
        } else {
            callback(new BizError("没有id为" + id + "的文章"),null);
        }
    });
};

Post.getByUrl = function (url, callback) {
    var selectSql = "select * from posts where url=? and status=?";
    var values = [url, PostStatus.published];
    db.query(selectSql, values, function (error, rows) {
        if (error) {
           callback(error,null);
        }
        if (rows.length > 0) {
            var post = new Post(rows[0]);
            callback(null,post);
        } else {
            callback(new bizError('该文章不存在或已被删除。'),null);
        }
    });
};

Post.updatePageView = function (id, callback) {
    var sql = "update posts set pageView=pageView+1 where id=?";
    var values = [id];
    db.query(sql, values, function (error) {
        if (error) {
            callback(error,null);
        }
        callback(null,true);
    });
};

Post.getPagedBlogs = function (pageIndex, pageSize, callback) {
    var startIndex = (pageIndex - 1) * pageSize;
    var endIndex = pageIndex * pageSize;
    var sql = "select id,title,abstract,url,pageView,postedTime from posts where status=? and type=? order by postedTime desc limit ?,?";
    var values = [PostStatus.published,PostType.Blog,startIndex, endIndex];
    db.query(sql, values, function (error, rows) {
        if (error) {
            callback(error,null);
        }
        var posts = [];
        for (var index = 0; index < rows.length; index++) {
            posts.push(new Post(rows[index]));
        }
        callback(null,posts);
    });
};

Post.getBlogsCount = function (callback) {
    var sql = "select count(*) as count from posts where status=? and type=? ";
    var values=[PostStatus.published,PostType.Blog];
    db.query(sql,values, function (error, rows) {
        if (error) {
            callback(error,null);
        }
        if (rows.length > 0) {
            callback(null,rows[0].count);
        }
        else {
            callback(null,0);
        }
    });
};


exports.Post = Post;
exports.PostType=PostType;
exports.PostStatus = PostStatus;