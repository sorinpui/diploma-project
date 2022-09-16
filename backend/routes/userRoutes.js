const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

const {
  signupUser,
  getUsers,
  getUser,
  getPerformers,
  updateUser, 
  deleteUser, 
  loginUser
} = require("../controllers/userController");

// CREATE (signup)
router.post("/signup", signupUser);

// LOGIN a user
router.post("/login", loginUser);

// READ
router.get("/", getUsers);
router.get("/performers", getPerformers);
router.get("/:email", getUser);

// auth middleware
router.use(requireAuth);

// UDPATE
router.patch("/", updateUser);

// DELETE
router.delete("/:id", deleteUser);

module.exports = router;
