const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  contestant: { type: Boolean, required: true, default: false },
  performances: [{ type: Schema.Types.ObjectId, ref: "Performance" }]
}, {
  timestamps: true
});

userSchema.statics.signup = async function(firstName, lastName, email, password, age, contestant) {
  // validation
  if (!firstName || !lastName || !email || !password || !age || contestant === null) {
    throw new Error("All fields are mandatory.");
  }

  let re = /^[A-Z][a-z-]+$/;

  if (!re.test(firstName)) {
    throw new Error("Please enter your first name correctly.");
  }

  if (!re.test(lastName)) {
    throw new Error("Please enter your last name correctly.");
  }

  if ((age < 19 || age > 23) && contestant === true) {
    throw new Error("You must be at least 19 and up to 23 years old to participate.");
  }

  re = /^[a-zA-Z0-9-+.]+@[a-zA-Z0-9-]+\.(com|ro)$/;

  if (!re.test(email)) {
    throw new Error("Please enter a valid email.");
  }
  
  re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*)(]).{8,}/;

  if (!re.test(password)) {
    throw new Error("Your password must contain at least 8 characters, lowercase and uppercase letters, numbers and symbols.");
  }
    
  const exists = await this.findOne({email});

  if (exists) {
    throw new Error("This email is already in use.");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({firstName, lastName, email, password: hash, age, contestant});
  
  return user;
};

userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw new Error("All fields are mandatory.");
  }

  const user = await this.findOne({email});

  if (!user) {
    throw new Error("There's no account registered with this email.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("The password is incorrect.");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
