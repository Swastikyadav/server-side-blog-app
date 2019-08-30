var express = require('express');
var Comment = require('../models/comments');
var Article = require('../models/articles');
var auth = require('../modules/auth');
var router = express.Router();

// Below routes will be available only if user is logged in.
router.use(auth.isLogged);

// Creating new comments, and pushing it to related article.
router.post('/:id/comments', (req, res, next) => {
    var id = req.params.id;
    req.body.article_id = id;
   Comment.create(req.body, (err, createdComment) => {
       if(err) return next(err);
       Article.findByIdAndUpdate(id, {$push: {comments_id: createdComment.id}}, {new: true}, (err, updatedArticle) => {
           if(err) return next(err);
           res.redirect(`/article/${id}`);
       });
   }); 
});

// Delete a comment with its id
router.get('/comment/delete/:id', (req, res, next) => {
    var id = req.params.id;
    Comment.findByIdAndDelete(id, (err, deletedComment) => {
        if(err) return next (err);
        res.redirect(`/article/${deletedComment.article_id}`);
    });
});


// Updating comments.
router.get('/comment/update/:id', (req, res, next) => {
    var id = req.params.id;
    Comment.findById(id, (err, comment) => {
        if(err) return next(err);
        res.render('updatecomment', {comment});
    });
});

router.post('/comment/update/:id', (req, res, next) => {
    var id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, {new: true}, (err, updatedComment) => {
        if(err) return next(err);
        console.log(updatedComment);
        res.redirect(`/article/${updatedComment.article_id}`);
    });
});


module.exports = router;