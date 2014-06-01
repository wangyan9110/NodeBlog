/**
 * @author yywang
 */

var category = require('../models/Category').Category;
var posts = require('../models/Post').Post;
var postStatus = require('../models/Post').PostStatus;
var postType = require('../models/Post').PostType;
var guid = require("../common/Guid").guid;
var bizError = require('../common/BlogError').BizError;

exports.edit = function (req, res) {
    category.getAll(function (error, categorys) {
        if (error) {
            req.flash('error', error);
            return res.redirect('/');
        }
        res.render('editPost', {categorys: categorys});
    });
}

function removeHTMLTag(str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
    str = str.replace(/&nbsp;/ig, '');//去掉&nbsp;
    return str;
}

function getAbstract(contentHTML) {
    var content = removeHTMLTag(contentHTML);
    if (content.length <= 200) {
        return content;
    } else {
        return content.substring(0, 200) + "...";
    }
}

exports.editAction = function (req, res) {
    var title = req.body['title'];
    var content = req.body['content'];
    var categoryIds = req.body['categorys'];
    var status = req.body['action'];
    var pos = new posts(req.body);
    pos.id = guid();
    pos.title = title;
    pos.content = content;
    pos.status = postStatus.create(status);
    pos.url = pos.id;//暂时先为id
    pos.abstract = getAbstract(content);
    pos.type = postType.Blog;
    var categorys = category.getByIds(categoryIds, function (error,categorys) {
        if(error){
            req.flash('error', error);
            return res.redirect('/');
        }
        pos.categorys = categorys;
        pos.save(function (error, status) {
            if (error) {
                req.flash('error', new BizError(pos.title + '保存失败！'));
            } else {
                req.flash('success', pos.title + '保存成功！');
            }
            res.redirect('/');
        });
    });
}

exports.list = function (req, res) {
    var currPagaIndex = req.params.pageIndex;
    var pageSize = 15;
    if (!currPagaIndex) {
        currPagaIndex = 1;
    }
    posts.getBlogsCount(function (error,postsCount) {
        if(error){
            req.flash('error', error);
            return res.redirect('/');
        }
        posts.getPagedBlogs(currPagaIndex, pageSize, function (error,posts) {
            if(error){
                req.flash('error', error);
                return res.redirect('/');
            }
            var totalPage = 1;
            if (postsCount % pageSize == 0) {
                totalPage = postsCount / pageSize;
            } else {
                totalPage = postsCount / pageSize + 1;
            }
            var categorys = category.getAll(function (error,categorys) {
                if(error){
                    req.flash('error', error);
                    return res.redirect('/');
                }
                res.render('index', {total: totalPage, posts: posts, currPage: currPagaIndex, categorys: categorys});
            });
        });
    });
}

exports.get = function (req, res) {
    var url = req.params.url;
    posts.getByUrl(url, function (error,post) {
        if(error){
            req.flash('error', error);
            return res.redirect('/');
        }
        //更新pageview
        posts.updatePageView(post.id, function (error,isTrue) {
            if(error){
                req.flash('error', error);
                return res.redirect('/');
            }
            category.getAll(function (error,categorys) {
                if(error){
                    req.flash('error', error);
                    return res.redirect('/');
                }
                res.render('post', {post: post, categorys: categorys});
            });
        });
    });
}
