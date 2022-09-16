const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
  createComment,
  getComments,
  deleteComment
} = require("../controllers/commentController");

const router = express.Router();

// auth middleware
router.use(requireAuth);

// CREATE new comment
router.post("/", createComment);

// READ comments
router.get("/:id", getComments);

// DELETE comment
router.delete("/:id", deleteComment);

module.exports = router;
