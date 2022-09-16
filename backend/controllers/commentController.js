const mongoose = require("mongoose");
const Comment = require("../models/Comment");

// GET all comments
const getComments = async (req, res) => {
  // id -> the id of the performance, used for displaying only that performance's comments
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({errorMessage: "The performance doesn't exist."});
  }
  const comments = await Comment.find({performance_id: id}).populate("author_id").sort({createdAt: -1});
  res.status(200).json(comments);
};

// POST a comment
const createComment = async (req, res) => {
  const {performance_id, text} = req.body;
  const {_id: author_id} = req.user;

  if (!text) {
    return res.status(400).json({errorMessage: "You cannot post an empty comment."});
  }

  let comment = await Comment.create({performance_id, author_id, text});
  comment = await comment.populate("author_id");
  res.status(201).json(comment);
}

// DELETE a comment
const deleteComment = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({errorMessage: "The comment doesn't exist."});
  }

  const comment = await Comment.findByIdAndDelete(id);
  if (!comment) {
    return res.status(200).json({errorMessage: "The comment doesn't exist."});
  }

  res.status(200).json(comment);
}

module.exports = { createComment, getComments, deleteComment };
