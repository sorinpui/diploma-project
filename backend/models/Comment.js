const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  performance_id: {
    type: Schema.Types.ObjectId,
    ref: "Performance",
    required: true
  },
  author_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Comment", commentSchema);
