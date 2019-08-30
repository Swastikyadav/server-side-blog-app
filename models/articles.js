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
   comments_id: {
       type: [Schema.Types.ObjectId],
       ref: "Comment"
   },
   authorId: {
       type: String,
       required: true
   }
});

var Article = mongoose.model('Articles', articlesSchema);

module.exports = Article;