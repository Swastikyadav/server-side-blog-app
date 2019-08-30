var User = require('../models/users');

// Check if user is logged in or not.
exports.checkLoggedUser = (req, res, next) => {
    if(req.session && req.session.userId) {
        User.findById(req.session.userId, (err, user) => {
            if(err) return next(err);
            req.user = user;
            res.locals.user = user;
            next();
        });
    } else {
        req.user = null;
        res.locals.user = null;
        next();
    }
}

// Check user logged status, and call next accordingly.
exports.isLogged = (req, res, next) => {
    if(req.session.userId) {
        next();
    } else {
        res.redirect('/users/login');
    }
}