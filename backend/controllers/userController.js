const mongoose = require("mongoose");
const Perf = require("../models/Performance");
const User = require("../models/User");
const Comment = require("../models/Comment");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// id is the _id property of the user
const createToken = (id) => {
  return jwt.sign({id}, process.env.SECRET, {expiresIn: "1d"});
};

// CREATE a user
const signupUser = async (req, res) => {
  const {firstName, lastName, email, password, age, contestant} = req.body;

  let emptyFields = [];

  if (!firstName) {
    emptyFields.push("firstName");
  }

  if (!lastName) {
    emptyFields.push("lastName");
  }

  if (!email) {
    emptyFields.push("email")
  }

  if (!password) {
    emptyFields.push("password");
  }

  if (!age) {
    emptyFields.push("age");
  }

  if (contestant === null) {
    emptyFields.push("contestant");
  }

  try {
    const user = await User.signup(firstName, lastName, email, password, age, contestant);

    // create the token
    const token = createToken(user._id);

    res.status(201).json({firstName, lastName, email, age, contestant, token});
  } catch (err) {
    console.log(err);
    res.status(400).json({errorMessage: err.message, emptyFields});
  }
};

// LOGIN user
const loginUser = async (req, res) => {
  const {email, password} = req.body;

  let emptyFields = [];

  if (!email) {
    emptyFields.push("email")
  }
  
  if (!password) {
    emptyFields.push("password");
  }

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({email, token});
  } catch (err) {
    res.status(400).json({errorMessage: err.message, emptyFields});
  }
}

// GET all users
const getUsers = async (req, res) => {
  const users = await User.find({}).populate("performances");
  res.status(200).json(users);
};

// GET all performers 
const getPerformers = async (req, res) => {
  const fields = "firstName lastName age performances"
  const performers = await User.find({contestant: true}, fields).populate("performances");
  res.status(200).json(performers);
}

// GET a single user
const getUser = async (req, res) => {
  const fields = "firstName lastName email age performances contestant"
  const user = await User.findOne({email: req.params.email}, fields).populate("performances");
  if (!user) {
    return res.status(404).json({errorMessage: "The user doesn't exist."});
  }
  res.status(200).json(user);
};

// DELETE a user
const deleteUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({errorMessage: "The user doesn't exist."});
  }
  
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({errorMessage: "The user doesn't exist."});
  }

  // delete user's performances
  await Perf.deleteMany({performer_id: req.params.id});
  
  // delete user's comments
  await Comment.deleteMany({author_id: req.params.id});
  
  res.status(200).json(user);
};

// UPDATE an user
const updateUser = async (req, res) => {
  // the id of the logged-in user who wants to update their data
  const {_id: user_id} = req.user;

  const dataToUpdate = {...req.body};
  const {firstName, lastName, age, currPass, newPass} = dataToUpdate;
  console.log(dataToUpdate);
  console.log(firstName, lastName, age, currPass, newPass);

  const user = await User.findById(user_id, "contestant password");

  let errorFields = [];

  try {

    let re = /^[A-Z][a-z-]+$/;
    let hash = null;

    if (firstName) {
      if (!re.test(firstName)) {
        errorFields.push("firstName");
      }
    }
  
    if (lastName) {
      if (!re.test(lastName)) {
        errorFields.push("lastName");
      }
    }
  
    if (age) {
      if (user.contestant && (age < 19 || age > 23)) {
        errorFields.push("age");
      }
    }
  
    if (currPass && newPass) {
      const match = await bcrypt.compare(currPass, user.password);
      if (!match) {
        errorFields.push("currPass");
      } else {
        re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*)(]).{8,}/;
        if (!re.test(newPass)) {
          errorFields.push("newPass");
        } else {
          const salt = await bcrypt.genSalt(10);
          hash = await bcrypt.hash(newPass, salt);
        }
      }
    }

    if (errorFields.length > 0) {
      throw new Error("bad fields");
    }

    let updatedUser = null;

    if (hash) {
      updatedUser = await User.findByIdAndUpdate(user_id, {...req.body, password: hash}, {returnDocument: "after"}).populate("performances");
    } else {
      updatedUser = await User.findByIdAndUpdate(user_id, {...req.body}, {returnDocument: "after"}).populate("performances");
    }

    console.log(updatedUser);
    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(400).json({error: error.message, errorFields});
  }

};

module.exports = { signupUser, getUsers, getUser, getPerformers, updateUser, deleteUser, loginUser };
