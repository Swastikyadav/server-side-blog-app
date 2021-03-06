var express = require('express');
var Article = require('../models/articles');
var User = require('../models/users');
var Comment = require('../models/comments');
var commentRouter = require('../routes/comments');
var auth = require('../modules/auth');

var router = express.Router();

// User registration.
router.get('/users/register', (req, res, next) => {
  res.render('userregister');
});

router.post('/users/register', (req, res, next) => {
  User.create(req.body, (err, newUser) => {
    if(err) return next(err);
    console.log(newUser);
    res.redirect('/users/login');
  });
});

// User Login
router.get('/users/login', (req, res, next) => {
  res.render('userslogin');
}); 

router.post('/users/login', (req, res, next) => {
  var email = req.body.email;
  var pass = req.body.password;
  User.findOne({email: email}, (err, user) => {
    if(err) return next(err);
    if(!user) return res.redirect('/users/login');
    if(!user.validatePassword(pass)) return res.redirect('/users/login');
    req.session.userId = user._id;
    res.redirect('/');
  });
});

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
    // var commentId = singleArticle.comments_id;
    // commentId.forEach(element => {
      Comment.find({article_id: id}, (err, articleComments) => {
        if(err) return next(err);
        // console.log(articleComments);
        res.render('singlearticle', {singleArticle, articleComments});
      })
    // });
  })
})

// Below routes will be available only if user is logged in.
router.use(auth.isLogged);

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
    // console.log(String(req.user._id), singleArticle.authorId);
    if(err) return next(err);
    if(String(req.user._id) === singleArticle.authorId) {
      res.render('updatearticle', {singleArticle});
    } else {
      res.redirect('/');
    }
  });
})

router.post('/article/update/:id', (req, res, next) => {
  id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, {new: true}, (err, updatedData) => {
    if(err) return next(err);
    res.redirect(`/article/${id}`);
  });
});

// Delete an article with its id. (All it's commnets should also get deleted.)
router.get('/article/delete/:id', (req, res, next) => {
  id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    if(String(req.user._id) === article.authorId) {
      Article.findByIdAndDelete(id, (err, deletedArticle) => {
        if(err) return next(err);
        console.log(deletedArticle.comments_id.length);
        if(deletedArticle.comments_id.length) {
          var commentsArr = deletedArticle.comments_id;
          console.log(commentsArr);
          commentsArr.forEach(c => {
            Comment.findByIdAndDelete(c, (err, deletedComment) => {
              if(err) return next(err);
              // res.redirect('index');  
            });
          });
          res.redirect('/');
        } else {
          console.log("no comments");
          res.redirect('/');
        }
      });
    } else {
      res.redirect('/');
    }
  });
});

// LogOut
router.get('/users/logout', (req, res, next) => {
  if(req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      } 
    });
  }
});

router.use('/article', commentRouter);

module.exports = router;
