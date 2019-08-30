var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentsSchema = new Schema({
   commentText: {
       type: String,
       required: true
   },
   comAuthor: {
       type: String,
       required: true
   },
   article_id: {
       type: Schema.Types.ObjectId,
       ref: "Article",
   },
   authorId: {
       type: String,
       required: true
   }
});

var Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;