var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articlesSchema = new Schema({
   title: {
       type: String,
       required: true
   },
   description: {
       type: String,
       required: true
   },
   artAuthor: {
       type: String,
       required: true
   },
   user_id: {
       type: Schema.Types.ObjectId,
       ref: "User"
   },
   comments_id: {
       type: [Schema.Types.ObjectId],
       ref: "Comment"
   }
});

var Article = mongoose.model('Articles', articlesSchema);

module.exports = Article;