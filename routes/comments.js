var express = require('express');
var Comment = require('../models/comments');
var Article = require('../models/articles');
var router = express.Router();

router.post('/:id/comments', (req, res, next) => {
    var id = req.params.id;
   Comment.create(req.body, (err, createdComment) => {
       if(err) return next(err);
       Article.findByIdAndUpdate(id, {$push: {createdComment}}, {new: true}, (err, updatedArticle) => {
           if(err) return next(err);
           res.redirect(`/article/${id}`);
       });
   }); 
});

module.exports = router;