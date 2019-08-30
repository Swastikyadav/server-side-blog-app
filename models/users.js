var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var userSchema = new Schema({
   name: {
       type: String,
       required: true
   },
   email: {
       type: String,
       required: true,
       match: /@/,
       unique: true,
   },
   password: {
       type: String,
       required: true
   }
});

// Hash password for new user while usering.
userSchema.pre('save', function(next) {
    if(this.password) {
        this.password = bcrypt.hashSync(this.password, 10);
        next();
    }
});

// Hash password coming from login form before comparing to actuall hashed password.
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

var User = mongoose.model('User', userSchema);

module.exports = User;