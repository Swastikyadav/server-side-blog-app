var User = require('../models/users');

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