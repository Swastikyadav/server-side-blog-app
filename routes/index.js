var express = require('express');
var Article = require('../models/articles');
var commentRouter = require('../routes/comments');

var router = express.Router();

/* GET all articles on home page. (Read articles) */
router.get('/', function(req, res, next) {
  Article.find({}, (err, data) => {
    if(err) return next(err);
    res.render('index', {data});
  });
});

// GET single article. Show details by id. (Read single article)
router.get('/article/:id', (req, res, next) => {
  id = req.params.id;
  Article.findById(id, (err, singleArticle) => {
    if(err) return next(err);
    res.render('singlearticle', {singleArticle});
  })
})

// Create new articles.
router.get('/newarticle', (req, res, next) => {
  res.render('newarticle');
})

router.post('/', (req, res, next) => {
  Article.create(req.body, (err, createdArticle) => {
    if(err) return next(err);
    res.redirect('/');
  });
})

// Update an existing article with id.
router.get('/article/update/:id', (req, res, next) => {
  id = req.params.id;
  Article.findById(id, (err, singleArticle) => {
    if(err) return next(err);
    res.render('updatearticle', {singleArticle});
  });
})

router.post('/article/update/:id', (req, res, next) => {
  id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, {new: true}, (err, updatedData) => {
    if(err) return next(err);
    res.redirect(`/article/${id}`);
  });
});

// Delete an article with its id.
router.get('/article/delete/:id', (req, res, next) => {
  id = req.params.id;
  Article.findByIdAndDelete(id, (err, deletedArticle) => {
    if(err) return next(err);
    res.redirect('/');
  });
});

router.use('/article', commentRouter);

module.exports = router;